import { once } from 'node:events';
import net from 'node:net';

/** Occupy an available TCP port until close() is called. */
export const occupyPort = async (host = '0.0.0.0') => {
  const server = net.createServer().listen({ port: 0, host });
  await once(server, 'listening');

  const { port } = server.address() as net.AddressInfo;

  return {
    port,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }),
  };
};
