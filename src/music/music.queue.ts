import type { QueuedTrack } from './types.js';

export class MusicQueue {
  private readonly items: QueuedTrack[] = [];
  current: QueuedTrack | null = null;

  enqueue(track: QueuedTrack): number {
    this.items.push(track);
    return this.items.length;
  }

  next(): QueuedTrack | null {
    this.current = this.items.shift() ?? null;
    return this.current;
  }

  clear(): void {
    this.items.length = 0;
    this.current = null;
  }

  size(): number {
    return this.items.length;
  }

  hasPending(): boolean {
    return this.items.length > 0;
  }

  all(): readonly QueuedTrack[] {
    return this.items;
  }
}
