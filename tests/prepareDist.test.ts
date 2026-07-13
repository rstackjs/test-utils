import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'rstack/test';
import { prepareDist } from '../src/index';

test('should remove a dist directory and return its absolute path', async () => {
  const directoryPath = await mkdtemp(join(tmpdir(), 'rstack-test-utils-'));
  const distPath = join(directoryPath, 'dist-custom');

  try {
    await mkdir(distPath);
    await writeFile(join(distPath, 'index.js'), 'content');

    await expect(prepareDist(distPath)).resolves.toBe(distPath);
    expect(existsSync(distPath)).toBe(false);

    await expect(prepareDist(distPath)).resolves.toBe(distPath);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
