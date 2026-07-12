import net from 'node:net';

const usedPorts = new Set<number>();

/**
 * Check whether a TCP port is available to bind.
 *
 * The port is released before the returned promise resolves.
 */
export const isPortAvailable = (port: number) => {
  try {
    const server = net.createServer().listen(port);
    return new Promise<boolean>((resolve) => {
      server.on('listening', () => {
        server.close(() => {
          resolve(true);
        });
      });
      server.on('error', () => {
        resolve(false);
      });
    });
  } catch {
    return Promise.resolve(false);
  }
};

/**
 * Return an available TCP port that has not been returned by this process.
 *
 * The default starting port is randomly selected between 15000 and 45000.
 */
export const getRandomPort = async (
  startPort = Math.ceil(Math.random() * 30000) + 15000,
) => {
  let port = startPort;

  while (port <= 65535) {
    if (!usedPorts.has(port) && (await isPortAvailable(port))) {
      usedPorts.add(port);
      return port;
    }
    port++;
  }

  throw new Error('No available ports found in the valid range.');
};
