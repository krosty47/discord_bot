import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

export const helpCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('help').setDescription('Muestra ayuda básica del bot.'),
  async execute(interaction) {
    await interaction.reply([
      'Bot de música local:',
      '`/list` muestra los MP3 disponibles.',
      '`/play song:<archivo.mp3>` reproduce o agrega a la cola.',
      '`/pause` pausa la canción actual.',
      '`/resume` reanuda la canción pausada.',
      '`/skip` salta a la siguiente canción.',
      '`/stop` detiene todo y desconecta el bot.',
      '',
      'Solo reproduce archivos `.mp3` dentro de la carpeta `music/`.',
    ].join('\n'));
  },
};
