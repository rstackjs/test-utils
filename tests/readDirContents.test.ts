import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'rstack/test';
import { readDirContents } from '../src/index';

test('should recursively read directory contents with absolute paths', async () => {
  const directoryPath = await mkdtemp(join(tmpdir(), 'rstack-test-utils-'));
  const nestedDirectoryPath = join(directoryPath, 'nested');
  const indexPath = join(directoryPath, 'index.js');
  const stylePath = join(nestedDirectoryPath, 'style.css');

  try {
    await mkdir(nestedDirectoryPath);
    await Promise.all([
      writeFile(indexPath, 'console.log("hello")'),
      writeFile(stylePath, '.root {}'),
    ]);

    expect(await readDirContents(directoryPath)).toEqual({
      [indexPath]: 'console.log("hello")',
      [stylePath]: '.root {}',
    });
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
