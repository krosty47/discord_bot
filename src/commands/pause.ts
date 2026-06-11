import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const pauseCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pausa la canción actual.'),
  async execute(interaction, { voiceMusic }) {
    await interaction.deferReply();

    if (!interaction.guildId) {
      await interaction.editReply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    const message = voiceMusic.pause(interaction.guildId);
    await interaction.editReply(message);
  },
};
