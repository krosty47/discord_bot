import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const pauseCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pausa la canción actual.'),
  async execute(interaction, { voiceMusic }) {
    if (!interaction.guildId) {
      await interaction.reply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    await interaction.reply(voiceMusic.pause(interaction.guildId));
  },
};
