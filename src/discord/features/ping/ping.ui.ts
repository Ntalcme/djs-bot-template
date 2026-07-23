import type { SupportedLocale } from '@/core/types.js';
import type { Container } from '../../components/index.js';
import { createContainer, Separator, Text } from '../../components/index.js';
import { commandMessages } from '../../lang/index.js';

/** The latencies the ping container displays. */
export interface PingView {
  readonly totalLatencyMs: number;
  readonly discordLatencyMs: number;
}

/** Builds the Components V2 container shown by the `ping` command. */
export function buildPingContainer(
  view: PingView,
  language: SupportedLocale,
): Container {
  const { title, totalLatency, discordLatency } = commandMessages(
    language,
    'commandPing',
  );

  return createContainer('brand').add(
    new Text(title).title(),
    new Separator(),
    new Text(discordLatency(view.discordLatencyMs)).newLine(
      totalLatency(view.totalLatencyMs),
    ),
  );
}
