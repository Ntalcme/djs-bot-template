import { config } from '@/core/config/index.js';
import { BotClient } from '@/discord/client/index.js';

const client = new BotClient();
await client.init();
await client.login(config.discordToken);
