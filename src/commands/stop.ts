import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const stopCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Detiene la música, limpia la cola y desconecta el bot.'),
  async execute(interaction, { voiceMusic }) {
    if (!interaction.guildId) {
      await interaction.reply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    await interaction.reply(voiceMusic.stop(interaction.guildId));
  },
};
