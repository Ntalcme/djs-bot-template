import { Events } from 'discord.js';
import type { EventModule } from '../registries/index.js';
import { logger } from '@/shared/index.js';
import { runCommandPipeline } from '../pipeline/command-pipeline.js';
import { buildDenialHandlers } from '../pipeline/denial-handlers.js';
import { config } from '@/core/config/index.js';
import { sendResponseToInteraction } from '../interactions/index.js';
import { resolveLocale } from '../context/locale.js';

const event = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.registries.slash.get(
      interaction.commandName,
    );

    if (!command) {
      logger.warn(
        { command: interaction.commandName },
        'Unknown slash command',
      );
      return;
    }

    const inGuild = interaction.inGuild();
    const locale = resolveLocale(interaction.locale);
    const { gate } = command;

    await runCommandPipeline(
      {
        commandName: interaction.commandName,
        requirements: command.requirements,
        inGuild,
        inMainGuild:
          inGuild && interaction.guildId === config.mainGuildDiscordId,
        userId: interaction.user.id,
      },
      {
        execute: () => command.execute(interaction),
        ...buildDenialHandlers({
          locale,
          commandName: interaction.commandName,
          logLabel: 'Slash command failed',
          reply: (response) => sendResponseToInteraction(interaction, response),
        }),
        ...(gate ? { gate: () => gate(interaction) } : {}),
      },
    );
  },
} satisfies EventModule<Events.InteractionCreate>;

export default event;
