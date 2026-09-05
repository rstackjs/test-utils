import { once } from 'node:events';
import net from 'node:net';
import { expect, test } from 'rstack/test';
import { occupyPort } from '../src/index';

test('should occupy a port and release it when closed', async () => {
  const { port, close } = await occupyPort();
  const server = net.createServer();
  const options = { port, host: '0.0.0.0' };

  try {
    try {
      server.listen(options);
      await expect(once(server, 'listening')).rejects.toMatchObject({
        code: 'EADDRINUSE',
      });
    } finally {
      await close();
    }

    server.listen(options);
    await once(server, 'listening');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
