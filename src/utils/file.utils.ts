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

export function normalizeRelativeMp3Path(relativePath: string): string | null {
  const trimmedPath = relativePath.trim();
  if (!trimmedPath || path.isAbsolute(trimmedPath) || path.win32.isAbsolute(trimmedPath) || path.posix.isAbsolute(trimmedPath)) {
    return null;
  }

  const parts = trimmedPath.split(/[\\/]+/).filter(Boolean);
  if (parts.length === 0) return null;

  const hasUnsafePart = parts.some((part) => part === '.' || part === '..' || part !== path.basename(part));
  if (hasUnsafePart || !hasMp3Extension(parts.at(-1) ?? '')) return null;

  return parts.join('/');
}

export function resolveInsideDirectory(baseDirectory: string, childName: string): string | null {
  const normalizedChild = normalizeRelativeMp3Path(childName);
  if (!normalizedChild) return null;

  const resolvedBase = path.resolve(baseDirectory);
  const resolvedChild = path.resolve(resolvedBase, ...normalizedChild.split('/'));
  const relative = path.relative(resolvedBase, resolvedChild);

  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return resolvedChild;
}

export function toFriendlySongName(fileName: string): string {
  const songName = fileName.split(/[\\/]+/).at(-1) ?? fileName;
  return path.basename(songName, path.extname(songName)).replace(/[-_]+/g, ' ').trim() || fileName;
}
