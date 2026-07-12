import net from 'node:net';
import { expect, test } from 'rstack/test';
import { getRandomPort } from '../src/index';

const canListen = (port: number) => {
  const server = net.createServer();

  return new Promise<boolean>((resolve) => {
    server.on('error', () => {
      resolve(false);
    });
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
  });
};

test('should return an available port without reusing it', async () => {
  const port = await getRandomPort();
  const nextPort = await getRandomPort(port);

  expect(await canListen(port)).toBe(true);
  expect(nextPort).toBeGreaterThan(port);
});
