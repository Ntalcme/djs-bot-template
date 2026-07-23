import { Events } from 'discord.js';
import type { EventModule } from '../registries/index.js';
import { runCommandPipeline } from '../pipeline/command-pipeline.js';
import { buildDenialHandlers } from '../pipeline/denial-handlers.js';
import { config } from '@/core/config/index.js';
import { COMMAND_PREFIX } from '../utils/constants.js';
import { sendResponseToMessage } from '../interactions/index.js';
import { resolveLocale } from '../context/locale.js';

const event = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    const prefix = message.content.slice(0, COMMAND_PREFIX.length);
    if (prefix.toLowerCase() !== COMMAND_PREFIX) return;

    const withoutPrefix = message.content.slice(COMMAND_PREFIX.length).trim();
    if (withoutPrefix.length === 0) return;

    const parts = withoutPrefix.split(/\s+/);
    const name = parts[0];
    if (name === undefined) return;
    const args = parts.slice(1);

    const command = message.client.registries.prefix.get(name);
    if (!command) return;

    const inGuild = message.inGuild();
    const locale = resolveLocale(message.guild?.preferredLocale);
    const { gate } = command;

    await runCommandPipeline(
      {
        commandName: command.name,
        requirements: command.requirements,
        inGuild,
        inMainGuild: inGuild && message.guildId === config.mainGuildDiscordId,
        userId: message.author.id,
      },
      {
        execute: () => command.execute(message, args),
        ...buildDenialHandlers({
          locale,
          commandName: command.name,
          logLabel: 'Prefix command failed',
          reply: async (response) => {
            await sendResponseToMessage(message, response);
          },
        }),
        ...(gate ? { gate: () => gate(message, args) } : {}),
      },
    );
  },
} satisfies EventModule<Events.MessageCreate>;

export default event;
