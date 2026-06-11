import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const stopCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Detiene la música, limpia la cola y desconecta el bot.'),
  async execute(interaction, { voiceMusic }) {
    await interaction.deferReply();

    if (!interaction.guildId) {
      await interaction.editReply('Este comando solo funciona dentro de un servidor de Discord.');
      return;
    }

    const message = voiceMusic.stop(interaction.guildId);
    await interaction.editReply(message);
  },
};
