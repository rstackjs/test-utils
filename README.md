# @rstackjs/test-utils

<p>
  <a href="https://npmjs.com/package/@rstackjs/test-utils">
   <img src="https://img.shields.io/npm/v/@rstackjs/test-utils?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@rstackjs/test-utils?minimal=true"><img src="https://img.shields.io/npm/dm/@rstackjs/test-utils.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

Shared testing utilities for the Rstack ecosystem.

## Installation

```bash
# pnpm
pnpm add @rstackjs/test-utils -D
# yarn
yarn add @rstackjs/test-utils -D
# npm
npm add @rstackjs/test-utils -D
# bun
bun add @rstackjs/test-utils -D
```

## Usage

### editFile

Edits a file using a sync or async editor function.

```ts
import { editFile } from '@rstackjs/test-utils';

await editFile('src/index.ts', (content) =>
  content.replace('const value = 1', 'const value = 2'),
);
```

### findFile

Finds the first matching path in a file-content map. String matchers use suffix matching, and content hashes are ignored by default.

```ts
import { findFile } from '@rstackjs/test-utils';

const files = {
  '/dist/index.abcdef12.js': 'console.log("hello")',
  '/dist/styles.css': '.root {}',
};

const scriptPath = findFile(files, 'index.js');
// /dist/index.abcdef12.js
```

The matcher can be a string, regular expression, or function. Set `ignoreHash` to `false` to match the original path.

```ts
findFile(files, /styles\.css$/);
findFile(files, (file) => file.endsWith('.css'));
findFile(files, 'index.abcdef12.js', { ignoreHash: false });
```

### getDistFiles

Recursively reads UTF-8 files from a dist directory. Source map files are excluded by default.

```ts
import { getDistFiles } from '@rstackjs/test-utils';

const files = await getDistFiles('./dist');
const filesWithSourceMaps = await getDistFiles('./dist', true);
```

### getFileContent

Returns the content of the first file matched by the same matcher and options supported by `findFile`.

```ts
import { getFileContent } from '@rstackjs/test-utils';

const content = getFileContent(files, 'index.js');
// console.log("hello")
```

### getRandomPort

Returns an available TCP port that has not already been returned by the current process.

```ts
import { getRandomPort } from '@rstackjs/test-utils';

const port = await getRandomPort();
```

You can optionally provide the starting port. If it is unavailable, the next available port is returned.

```ts
const port = await getRandomPort(30000);
```

### isPortAvailable

Checks whether a TCP port is currently available to bind. The port is released before the promise resolves.

```ts
import { isPortAvailable } from '@rstackjs/test-utils';

const available = await isPortAvailable(30000);
```

### proxyConsole

Captures console output and removes ANSI control characters. By default, it captures `log`, `warn`, `info`, and `error`.

```ts
import { proxyConsole } from '@rstackjs/test-utils';

const logHelper = proxyConsole({ types: ['warn', 'error'] });

try {
  console.warn('Something happened');
  console.error('Something failed');

  await logHelper.expectLog('Something happened');
  logHelper.expectNoLog('Unexpected error');
} finally {
  logHelper.restore();
}

console.log(logHelper.logs);
```

### normalizeEol

Normalizes CRLF line endings to LF.

```ts
import { normalizeEol } from '@rstackjs/test-utils';

const content = normalizeEol('first line\r\nsecond line\r\n');
// first line\nsecond line\n
```

### prepareDist

Removes a dist directory and returns its absolute path. It removes `dist` from the current working directory by default.

```ts
import { prepareDist } from '@rstackjs/test-utils';

const distPath = await prepareDist();
const customDistPath = await prepareDist('dist-custom');
```

### readDirContents

Recursively reads UTF-8 files from a directory and returns a file-content map keyed by sorted POSIX absolute paths.

```ts
import { readDirContents } from '@rstackjs/test-utils';

const files = await readDirContents('./dist');

for (const [filePath, content] of Object.entries(files)) {
  console.log(filePath, content);
}
```

### toPosixPath

Converts backslash path separators to POSIX forward slashes.

```ts
import { toPosixPath } from '@rstackjs/test-utils';

const normalizedPath = toPosixPath('C:\\project\\src\\index.ts');
// C:/project/src/index.ts
```

### waitFor

Waits for a duration or polls a synchronous or asynchronous condition until it returns `true`.

```ts
import { waitFor } from '@rstackjs/test-utils';

await waitFor(() => server.isReady(), {
  interval: 50,
  timeout: 5000,
});
```

Condition polling uses a 100ms interval and a 5-second timeout by default.

## License

[MIT](./LICENSE).
