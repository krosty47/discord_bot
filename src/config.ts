import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta configurar ${name} en el archivo .env`);
  }
  return value;
}

function readVolume(): number {
  const raw = process.env.DEFAULT_VOLUME ?? '0.5';
  const volume = Number(raw);

  if (!Number.isFinite(volume) || volume < 0 || volume > 1) {
    throw new Error('DEFAULT_VOLUME debe ser un número entre 0 y 1. Ejemplo: 0.5');
  }

  return volume;
}

export const config = {
  discordToken: readRequiredEnv('DISCORD_TOKEN'),
  clientId: readRequiredEnv('DISCORD_CLIENT_ID'),
  guildId: readRequiredEnv('DISCORD_GUILD_ID'),
  musicDir: path.resolve(process.env.MUSIC_DIR ?? './music'),
  defaultVolume: readVolume(),
};
