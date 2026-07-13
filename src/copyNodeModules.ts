import { cp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/** Copy `_node_modules` to `node_modules` in a directory. */
export const copyNodeModules = async (cwd = process.cwd()): Promise<string> => {
  const rootPath = resolve(cwd);
  const sourcePath = join(rootPath, '_node_modules');
  const targetPath = join(rootPath, 'node_modules');

  await rm(targetPath, { force: true, recursive: true });
  await cp(sourcePath, targetPath, { recursive: true });

  return targetPath;
};
