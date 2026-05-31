import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const resumeCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Reanuda una canción pausada.'),
  async execute(interaction, { voiceMusic }) {
    if (!interaction.guildId) {
      await interaction.reply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    await interaction.reply(voiceMusic.resume(interaction.guildId));
  },
};
