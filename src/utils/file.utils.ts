import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureDirectory(directory: string): Promise<void> {
  await fs.mkdir(directory, { recursive: true });
}

export function hasMp3Extension(fileName: string): boolean {
  return path.extname(fileName).toLowerCase() === '.mp3';
}

export function isSafeFileName(fileName: string): boolean {
  return fileName === path.basename(fileName) && !fileName.includes('..') && hasMp3Extension(fileName);
}

export function resolveInsideDirectory(baseDirectory: string, childName: string): string | null {
  if (!isSafeFileName(childName)) return null;

  const resolvedBase = path.resolve(baseDirectory);
  const resolvedChild = path.resolve(resolvedBase, childName);
  const relative = path.relative(resolvedBase, resolvedChild);

  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return resolvedChild;
}

export function toFriendlySongName(fileName: string): string {
  return path.basename(fileName, path.extname(fileName)).replace(/[-_]+/g, ' ').trim() || fileName;
}
