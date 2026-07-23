import type { SupportedLocale } from '@/core/types.js';
import type { CommandResponse } from '../../interactions/index.js';
import { buildPingContainer } from './ping.ui.js';

/** The measurements a command front hands to {@link runPingCommand}. */
export interface RunPingInput {
  readonly totalLatencyMs: number;
  readonly discordLatencyMs: number;
}

/** Builds the `ping` command's response from the measured latencies. */
export function runPingCommand(
  input: RunPingInput,
  language: SupportedLocale,
): CommandResponse {
  return {
    container: buildPingContainer(
      {
        totalLatencyMs: input.totalLatencyMs,
        discordLatencyMs: input.discordLatencyMs,
      },
      language,
    ),
  };
}
