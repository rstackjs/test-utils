import { expect, test } from 'rstack/test';
import { createLogHelper, proxyConsole } from '../src/index';

test('should capture console output and expose the Rsbuild log helpers', async () => {
  const originalLog = console.log;
  const logHelper = proxyConsole({ types: 'log' });

  try {
    const pendingLog = logHelper.expectLog('second log');

    console.log('\u001B[31mfirst log\u001B[39m', { value: 1 });
    console.log('second log');

    await expect(pendingLog).resolves.toBe(true);
    expect(logHelper.logs).toEqual(['first log {"value":1}', 'second log']);
    expect(logHelper.originalLogs).toEqual([
      '\u001B[31mfirst log\u001B[39m {"value":1}',
      'second log',
    ]);
    expect(() => logHelper.expectNoLog('missing log')).not.toThrow();
    logHelper.expectLogTimes('{"value":1}second log', 0);
    logHelper.expectLogTimes(/^second log$/m, 1);

    logHelper.clearLogs();
    expect(logHelper.logs).toEqual([]);
    expect(logHelper.originalLogs).toHaveLength(2);
  } finally {
    logHelper.restore();
  }

  expect(console.log).toBe(originalLog);
});

test('should support strict and POSIX log matching', async () => {
  const logHelper = proxyConsole({ types: 'warn' });

  try {
    console.warn('path: C:\\project\\index.ts\nready');

    await expect(
      logHelper.expectLog('path: C:/project/index.ts', { posix: true }),
    ).resolves.toBe(true);
    await expect(logHelper.expectLog('ready', { strict: true })).resolves.toBe(
      true,
    );
  } finally {
    logHelper.restore();
  }
});

test('should count log occurrences across output chunks', () => {
  const logHelper = createLogHelper();
  const message = 'watching for changes...';

  logHelper.addLog(`${message}\n${message}\nwatching for `);
  logHelper.addLog('changes...\n');
  logHelper.expectLogTimes(message, 3);
  logHelper.expectLogTimes(/watching for changes\.\.\./, 3);

  expect(() => logHelper.expectLogTimes(message, 1)).toThrow(
    'Expected: 1\nReceived: 3',
  );

  logHelper.clearLogs();
  logHelper.expectLogTimes(message, 0);
  logHelper.addLog(message);
  logHelper.expectLogTimes(message, 1);
});

test('should strip ANSI sequences after joining output chunks', () => {
  const logHelper = createLogHelper();

  logHelper.addLog('watching for \u001B[3');
  logHelper.addLog('9mchanges...\n');
  logHelper.expectLogTimes('watching for changes...', 1);
});
