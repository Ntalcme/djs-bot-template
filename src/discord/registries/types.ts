import type { CommandRequirements } from '@/core/permissions/index.js';
import type {
  Awaitable,
  ChatInputCommandInteraction,
  ClientEvents,
  Message,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js';

/**
 * Minimal contract a slash command's `data` must satisfy. Structural on
 * purpose: `SlashCommandBuilder` (with or without options) satisfies it, but
 * the registry never depends on the exact builder variant.
 */
export interface SlashCommandData {
  readonly name: string;
  toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}

/**
 * A slash command module: metadata, access rules, and an executor. `gate` is an
 * optional extra check beyond `requirements` (a feature flag, a maintenance
 * switch); resolve `false` to refuse the run. It is a function property, not a
 * method, so a front can destructure it without unbinding `this`.
 */
export interface SlashCommand {
  readonly data: SlashCommandData;
  readonly requirements: CommandRequirements;
  execute(interaction: ChatInputCommandInteraction): Awaitable<void>;
  readonly gate?: (
    interaction: ChatInputCommandInteraction,
  ) => Awaitable<boolean>;
}

/** A legacy prefix (message-based) command module; `gate` mirrors {@link SlashCommand}. */
export interface PrefixCommand {
  readonly name: string;
  readonly aliases?: readonly string[];
  readonly requirements: CommandRequirements;
  execute(message: Message, args: readonly string[]): Awaitable<void>;
  readonly gate?: (
    message: Message,
    args: readonly string[],
  ) => Awaitable<boolean>;
}

/** A gateway event module bound to the client by the loader. */
export interface EventModule<
  K extends keyof ClientEvents = keyof ClientEvents,
> {
  readonly name: K;
  readonly once?: boolean;
  execute(...args: ClientEvents[K]): Awaitable<void>;
}

/** In-memory command tables the events dispatch against. */
export interface CommandRegistries {
  readonly slash: Map<string, SlashCommand>;
  /** Keyed by command name and each alias, all pointing to the same command. */
  readonly prefix: Map<string, PrefixCommand>;
}
