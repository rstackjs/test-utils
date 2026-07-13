import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { expect, test } from 'rstack/test';
import { waitForFile } from '../src/index';

test('should wait until a file exists', async () => {
  const directoryPath = await mkdtemp(join(tmpdir(), 'rstack-test-utils-'));
  const filePath = join(directoryPath, 'index.js');

  try {
    const writePromise = delay(10).then(() => writeFile(filePath, 'content'));

    await Promise.all([
      waitForFile(filePath, { interval: 1, timeout: 1000 }),
      writePromise,
    ]);
    expect(await readFile(filePath, 'utf-8')).toBe('content');
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
