import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { toPosixPath } from './toPosixPath.js';

const collectFilePaths = async (directoryPath: string): Promise<string[]> => {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const filePaths = await Promise.all(
    entries.map((entry) => {
      const filePath = join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return collectFilePaths(filePath);
      }
      return entry.isFile() ? [filePath] : [];
    }),
  );

  return filePaths.flat();
};

/**
 * Recursively read UTF-8 files from a directory.
 *
 * The returned record uses sorted POSIX absolute file paths as keys.
 */
export const readDirContents = async (
  directoryPath: string,
): Promise<Record<string, string>> => {
  const filePaths = await collectFilePaths(resolve(directoryPath));
  filePaths.sort();

  const entries = await Promise.all(
    filePaths.map(async (filePath) => [
      toPosixPath(filePath),
      await readFile(filePath, 'utf-8'),
    ]),
  );

  return Object.fromEntries(entries);
};
