import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from './types.js';

const DISCORD_AUTOCOMPLETE_VALUE_LIMIT = 100;

export const playCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción MP3 local o la agrega a la cola.')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('Nombre del archivo MP3 dentro de la carpeta music/')
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction, { voiceMusic }) {
    await interaction.deferReply();
    const song = interaction.options.getString('song', true);
    const message = await voiceMusic.play(interaction, song);
    await interaction.editReply(message);
  },
  async autocomplete(interaction, { musicLibrary }) {
    const focused = interaction.options.getFocused().toLowerCase();
    const tracks = await musicLibrary.listTracks();
    const choices = tracks
      .filter((track) => track.fileName.length <= DISCORD_AUTOCOMPLETE_VALUE_LIMIT)
      .filter((track) => track.fileName.toLowerCase().includes(focused) || track.displayName.toLowerCase().includes(focused))
      .slice(0, 25)
      .map((track) => ({ name: track.fileName, value: track.fileName }));

    await interaction.respond(choices);
  },
};
