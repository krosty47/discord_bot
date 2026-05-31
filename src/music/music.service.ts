import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import { ensureDirectory, hasMp3Extension, isSafeFileName, resolveInsideDirectory, toFriendlySongName } from '../utils/file.utils.js';
import type { MusicTrack } from './types.js';

export class MusicLibraryService {
  constructor(private readonly musicDirectory = config.musicDir) {}

  get directory(): string {
    return this.musicDirectory;
  }

  async ensureMusicDirectory(): Promise<void> {
    await ensureDirectory(this.musicDirectory);
  }

  async listTracks(): Promise<MusicTrack[]> {
    await this.ensureMusicDirectory();

    const entries = await fs.readdir(this.musicDirectory, { withFileTypes: true });
    const tracks = entries
      .filter((entry) => entry.isFile() && hasMp3Extension(entry.name) && isSafeFileName(entry.name))
      .map((entry) => {
        const absolutePath = resolveInsideDirectory(this.musicDirectory, entry.name);
        if (!absolutePath) return null;

        return {
          fileName: entry.name,
          displayName: toFriendlySongName(entry.name),
          absolutePath,
        } satisfies MusicTrack;
      })
      .filter((track): track is MusicTrack => track !== null)
      .sort((a, b) => a.fileName.localeCompare(b.fileName, 'es', { sensitivity: 'base' }));

    return tracks;
  }

  async findTrack(song: string): Promise<MusicTrack | null> {
    const requestedSong = path.basename(song.trim());
    if (!isSafeFileName(requestedSong)) return null;

    const tracks = await this.listTracks();
    return tracks.find((track) => track.fileName.toLowerCase() === requestedSong.toLowerCase()) ?? null;
  }
}
