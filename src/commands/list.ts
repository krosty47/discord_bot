import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

const DISCORD_MESSAGE_LIMIT = 2_000;
const LIST_REPLY_SAFE_LIMIT = 1_900;
const MAX_LISTED_TRACKS = 50;

export const listCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('list').setDescription('Lista las canciones MP3 disponibles.'),
  async execute(interaction, { musicLibrary }) {
    await interaction.deferReply();

    const tracks = await musicLibrary.listTracks();

    if (tracks.length === 0) {
      await interaction.editReply('No encontré canciones `.mp3` en la carpeta `music/`. Agregá archivos y volvé a usar `/list`.');
      return;
    }

    const header = 'Canciones disponibles:\n';
    const lines: string[] = [];
    let replyLength = header.length;

    for (const [index, track] of tracks.slice(0, MAX_LISTED_TRACKS).entries()) {
      const line = `${index + 1}. ${track.fileName}`;
      const nextLength = replyLength + line.length + 1;

      if (nextLength > LIST_REPLY_SAFE_LIMIT) break;

      lines.push(line);
      replyLength = nextLength;
    }

    const hiddenTracks = tracks.length - lines.length;
    const extra = hiddenTracks > 0 ? `\n...y ${hiddenTracks} más. Usá el autocomplete de \`/play\` para buscar.` : '';
    const message = `${header}${lines.join('\n')}${extra}`;

    await interaction.editReply(message.slice(0, DISCORD_MESSAGE_LIMIT));
  },
};
