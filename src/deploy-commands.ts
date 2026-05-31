import { REST, Routes } from 'discord.js';
import { commands } from './commands/index.js';
import { config } from './config.js';
import { logger } from './utils/logger.js';

const rest = new REST({ version: '10' }).setToken(config.discordToken);
const commandPayload = commands.map((command) => command.data.toJSON());

try {
  logger.info(`Registrando ${commandPayload.length} comandos slash en el servidor ${config.guildId}...`);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commandPayload });
  logger.info('Comandos registrados correctamente.');
} catch (error) {
  logger.error('No se pudieron registrar los comandos', error);
  process.exitCode = 1;
}
