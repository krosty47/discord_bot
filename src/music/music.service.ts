import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import { ensureDirectory, hasMp3Extension, normalizeRelativeMp3Path, resolveInsideDirectory, toFriendlySongName } from '../utils/file.utils.js';
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

    const tracks = await this.listTracksInsideDirectory();
    return tracks.sort((a, b) => a.fileName.localeCompare(b.fileName, 'es', { sensitivity: 'base' }));
  }

  async findTrack(song: string): Promise<MusicTrack | null> {
    const requestedSong = normalizeRelativeMp3Path(song);
    if (!requestedSong) return null;

    const tracks = await this.listTracks();
    return tracks.find((track) => track.fileName.toLowerCase() === requestedSong.toLowerCase()) ?? null;
  }

  private async listTracksInsideDirectory(relativeDirectory = ''): Promise<MusicTrack[]> {
    const absoluteDirectory = path.resolve(this.musicDirectory, ...relativeDirectory.split('/').filter(Boolean));
    const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });
    const tracks: MusicTrack[] = [];

    for (const entry of entries) {
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        tracks.push(...(await this.listTracksInsideDirectory(relativePath)));
        continue;
      }

      if (!entry.isFile() || !hasMp3Extension(entry.name)) continue;

      const normalizedPath = normalizeRelativeMp3Path(relativePath);
      if (!normalizedPath) continue;

      const absolutePath = resolveInsideDirectory(this.musicDirectory, normalizedPath);
      if (!absolutePath) continue;

      tracks.push({
        fileName: normalizedPath,
        displayName: toFriendlySongName(normalizedPath),
        absolutePath,
      });
    }

    return tracks;
  }
}
