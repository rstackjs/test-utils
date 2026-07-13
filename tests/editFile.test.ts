import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'rstack/test';
import { editFile } from '../src/index';

test('should edit a UTF-8 file', async () => {
  const directoryPath = await mkdtemp(join(tmpdir(), 'rstack-test-utils-'));
  const filePath = join(directoryPath, 'index.ts');

  try {
    await writeFile(filePath, 'const value = 1;');

    await editFile(filePath, (content) => content.replace('1', '2'));
    expect(await readFile(filePath, 'utf-8')).toBe('const value = 2;');

    await editFile(filePath, async (content) => content.replace('2', '3'));
    expect(await readFile(filePath, 'utf-8')).toBe('const value = 3;');
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
