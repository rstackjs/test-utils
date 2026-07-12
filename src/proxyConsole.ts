import {
  format as formatConsoleArgs,
  stripVTControlCharacters as stripAnsi,
} from 'node:util';

export type ConsoleMethod = 'error' | 'info' | 'log' | 'warn';

export type ProxyConsoleOptions = {
  /**
   * Console methods to capture.
   * @default ['log', 'warn', 'info', 'error']
   */
  types?: ConsoleMethod | ConsoleMethod[];
};

/**
 * Capture console output until `restore` is called.
 */
export const proxyConsole = ({
  types = ['log', 'warn', 'info', 'error'],
}: ProxyConsoleOptions = {}) => {
  const logs: string[] = [];
  const restores: Array<() => void> = [];

  const methods = new Set(Array.isArray(types) ? types : [types]);
  for (const type of methods) {
    const method = console[type];
    restores.push(() => {
      console[type] = method;
    });
    console[type] = (...args: unknown[]) => {
      logs.push(stripAnsi(formatConsoleArgs(...args)));
    };
  }

  let restored = false;
  const restore = () => {
    if (restored) {
      return;
    }
    restored = true;
    for (const restoreMethod of restores) {
      restoreMethod();
    }
  };

  return { logs, restore };
};
