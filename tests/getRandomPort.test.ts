import { once } from 'node:events';
import net from 'node:net';
import { expect, test } from 'rstack/test';
import { getRandomPort, isPortAvailable } from '../src/index';

test('should return an available port without reusing it', async () => {
  const port = await getRandomPort();
  const nextPort = await getRandomPort(port);

  expect(await isPortAvailable(port)).toBe(true);
  expect(nextPort).toBeGreaterThan(port);
});
