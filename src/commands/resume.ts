import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const resumeCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Reanuda una canción pausada.'),
  async execute(interaction, { voiceMusic }) {
    await interaction.deferReply();

    if (!interaction.guildId) {
      await interaction.editReply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    const message = voiceMusic.resume(interaction.guildId);
    await interaction.editReply(message);
  },
};
