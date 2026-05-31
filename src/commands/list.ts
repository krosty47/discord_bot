import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const listCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('list').setDescription('Lista las canciones MP3 disponibles.'),
  async execute(interaction, { musicLibrary }) {
    const tracks = await musicLibrary.listTracks();

    if (tracks.length === 0) {
      await interaction.reply('No encontré canciones `.mp3` en la carpeta `music/`. Agregá archivos y volvé a usar `/list`.');
      return;
    }

    const lines = tracks.slice(0, 50).map((track, index) => `${index + 1}. ${track.fileName}`);
    const extra = tracks.length > 50 ? `\n...y ${tracks.length - 50} más.` : '';
    await interaction.reply(`Canciones disponibles:\n${lines.join('\n')}${extra}`);
  },
};
