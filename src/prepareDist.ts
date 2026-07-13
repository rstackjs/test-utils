import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

/** Remove a dist directory and return its absolute path. */
export const prepareDist = async (distPath = 'dist'): Promise<string> => {
  const absolutePath = resolve(distPath);
  await rm(absolutePath, { force: true, recursive: true });
  return absolutePath;
};
