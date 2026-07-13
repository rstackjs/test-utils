import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'rstack/test';
import { copyNodeModules } from '../src/index';

test('should replace node_modules with a copy of _node_modules', async () => {
  const directoryPath = await mkdtemp(join(tmpdir(), 'rstack-test-utils-'));
  const sourcePackagePath = join(
    directoryPath,
    '_node_modules',
    'test-package',
  );
  const targetPath = join(directoryPath, 'node_modules');

  try {
    await mkdir(sourcePackagePath, { recursive: true });
    await mkdir(targetPath);
    await Promise.all([
      writeFile(join(sourcePackagePath, 'package.json'), '{"name":"test"}'),
      writeFile(join(targetPath, 'stale.js'), 'stale'),
    ]);

    await expect(copyNodeModules(directoryPath)).resolves.toBe(targetPath);
    expect(
      await readFile(join(targetPath, 'test-package', 'package.json'), 'utf-8'),
    ).toBe('{"name":"test"}');
    expect(existsSync(join(targetPath, 'stale.js'))).toBe(false);
  } finally {
    await rm(directoryPath, { force: true, recursive: true });
  }
});
