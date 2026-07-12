import { readDirContents } from './readDirContents.js';

/**
 * Recursively read UTF-8 files from a dist directory.
 *
 * Source map files are excluded by default.
 */
export const getDistFiles = async (
  distPath: string,
  sourceMaps = false,
): Promise<Record<string, string>> => {
  const files = await readDirContents(distPath);

  if (sourceMaps) {
    return files;
  }

  return Object.fromEntries(
    Object.entries(files).filter(([filePath]) => !filePath.endsWith('.map')),
  );
};
