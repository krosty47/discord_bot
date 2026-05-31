import type { Snowflake } from 'discord.js';

export interface MusicTrack {
  fileName: string;
  displayName: string;
  absolutePath: string;
}

export interface QueuedTrack {
  requestedBy: Snowflake;
  track: MusicTrack;
}
