import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'rstack/test';
import { getDistFiles, toPosixPath } from '../src/index';

test('should read dist files and optionally include source maps', async () => {
  const distPath = await mkdtemp(join(tmpdir(), 'rstack-test-utils-'));
  const nestedPath = join(distPath, 'static');
  const indexPath = join(distPath, 'index.js');
  const sourceMapPath = join(distPath, 'index.js.map');
  const stylePath = join(nestedPath, 'style.css');

  try {
    await mkdir(nestedPath);
    await Promise.all([
      writeFile(indexPath, 'console.log("hello")'),
      writeFile(sourceMapPath, '{}'),
      writeFile(stylePath, '.root {}'),
    ]);

    expect(await getDistFiles(distPath)).toEqual({
      [toPosixPath(indexPath)]: 'console.log("hello")',
      [toPosixPath(stylePath)]: '.root {}',
    });
    expect(await getDistFiles(distPath, true)).toEqual({
      [toPosixPath(indexPath)]: 'console.log("hello")',
      [toPosixPath(sourceMapPath)]: '{}',
      [toPosixPath(stylePath)]: '.root {}',
    });
  } finally {
    await rm(distPath, { force: true, recursive: true });
  }
});
