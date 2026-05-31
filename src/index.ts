import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { commands } from './commands/index.js';
import type { BotCommand, CommandContext } from './commands/types.js';
import { config } from './config.js';
import { MusicLibraryService } from './music/music.service.js';
import { VoiceMusicService } from './music/voice.service.js';
import { logger } from './utils/logger.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const commandMap = new Collection<string, BotCommand>();
for (const command of commands) {
  commandMap.set(command.data.name, command);
}

const musicLibrary = new MusicLibraryService();
const voiceMusic = new VoiceMusicService(musicLibrary);
const context: CommandContext = { musicLibrary, voiceMusic };

client.once('ready', async (readyClient) => {
  await musicLibrary.ensureMusicDirectory();
  logger.info(`Bot conectado como ${readyClient.user.tag}.`);
  logger.info(`Carpeta de música: ${musicLibrary.directory}`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isAutocomplete()) {
      const command = commandMap.get(interaction.commandName);
      if (!command?.autocomplete) return;

      await command.autocomplete(interaction, context);
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);
    if (!command) {
      await interaction.reply({ content: 'Comando no reconocido.', ephemeral: true });
      return;
    }

    await command.execute(interaction, context);
  } catch (error) {
    logger.error('Error procesando una interacción', error);

    const message = 'Ocurrió un error al ejecutar el comando. Revisá la consola del bot.';
    if (interaction.isRepliable()) {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: message, ephemeral: true });
      } else {
        await interaction.reply({ content: message, ephemeral: true });
      }
    }
  }
});

process.on('unhandledRejection', (error) => logger.error('Promesa rechazada sin manejar', error));
process.on('uncaughtException', (error) => logger.error('Excepción no capturada', error));

await client.login(config.discordToken);
