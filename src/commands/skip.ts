import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const skipCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Salta a la próxima canción de la cola.'),
  async execute(interaction, { voiceMusic }) {
    await interaction.deferReply();

    if (!interaction.guildId) {
      await interaction.editReply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    const message = voiceMusic.skip(interaction.guildId);
    await interaction.editReply(message);
  },
};
