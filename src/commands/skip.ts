import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const skipCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Salta a la próxima canción de la cola.'),
  async execute(interaction, { voiceMusic }) {
    if (!interaction.guildId) {
      await interaction.reply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    await interaction.reply(voiceMusic.skip(interaction.guildId));
  },
};
