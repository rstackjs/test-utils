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

Captures formatted console output and removes ANSI control characters. By default, it captures `log`, `warn`, `info`, and `error`.

```ts
import { proxyConsole } from '@rstackjs/test-utils';

const { logs, restore } = proxyConsole({ types: ['warn', 'error'] });

try {
  console.warn('Something happened');
  console.error('Something failed');
} finally {
  restore();
}

console.log(logs);
```

## License

[MIT](./LICENSE).
