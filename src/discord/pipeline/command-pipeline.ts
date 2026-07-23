import type {
  CommandRequirements,
  CommandScope,
} from '@/core/permissions/index.js';
import { checkCommandRequirements } from '@/core/permissions/index.js';
import { logger } from '@/shared/index.js';
import type { Awaitable } from 'discord.js';

/** Everything the pipeline needs to decide whether a command may run. */
export interface CommandPipelineContext {
  readonly commandName: string;
  readonly requirements: CommandRequirements;
  readonly inGuild: boolean;
  readonly inMainGuild: boolean;
  readonly userId: string;
}

/**
 * Front-specific callbacks injected by the slash and prefix events. The
 * pipeline decides *what* happens; the front decides *how* to communicate it
 * (interaction reply vs. message reply).
 */
export interface CommandPipelineHandlers {
  execute: () => Awaitable<void>;
  onScopeDenied: (scope: CommandScope) => Awaitable<void>;
  onPermissionDenied: () => Awaitable<void>;
  onUnexpectedError: (error: unknown) => Awaitable<void>;
  /** Optional extra gate (e.g. a feature flag, a maintenance switch); resolve `false` to block. */
  gate?: () => Awaitable<boolean>;
  onGateDenied?: () => Awaitable<void>;
}

/** Where a command was invoked from, for {@link logOutcome}. */
function invocationLocation(context: CommandPipelineContext): string {
  if (!context.inGuild) return 'dm';
  return context.inMainGuild ? 'mainGuild' : 'guild';
}

/** Logs every pipeline outcome at `debug`, so it is silent in production (see logger.ts) but visible while developing. */
function logOutcome(context: CommandPipelineContext, outcome: string): void {
  logger.debug(
    {
      command: context.commandName,
      userId: context.userId,
      location: invocationLocation(context),
    },
    `Command ${outcome}`,
  );
}

/**
 * Single, declarative dispatch shared by both command fronts:
 * optional gate -> requirements -> execution.
 * This is the only place access rules live, so slash and prefix never drift.
 * The whole run is wrapped so a failing *denial* reply (not just `execute`)
 * still surfaces through `onUnexpectedError` instead of being lost.
 */
export async function runCommandPipeline(
  context: CommandPipelineContext,
  handlers: CommandPipelineHandlers,
): Promise<void> {
  try {
    if (handlers.gate && !(await handlers.gate())) {
      logOutcome(context, 'denied (gate)');
      await handlers.onGateDenied?.();
      return;
    }

    const check = checkCommandRequirements(context.requirements, {
      inGuild: context.inGuild,
      inMainGuild: context.inGuild && context.inMainGuild,
      userId: context.userId,
    });
    if (!check.ok) {
      if (check.error === 'scope') {
        logOutcome(context, 'denied (scope)');
        await handlers.onScopeDenied(context.requirements.scope);
      } else {
        logOutcome(context, 'denied (authorization)');
        await handlers.onPermissionDenied();
      }
      return;
    }

    await handlers.execute();
    logOutcome(context, 'succeeded');
  } catch (error) {
    await handlers.onUnexpectedError(error);
  }
}
