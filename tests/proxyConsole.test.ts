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
    logHelper.expectLogTimes('second log', 1);

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

  logHelper.expectLogTimes(message, 0);
  logHelper.addLog(`${message}\n${message}\nwatching for `);
  logHelper.addLog('changes...\n');
  logHelper.expectLogTimes(message, 3);

  expect(() => logHelper.expectLogTimes(message, 1)).toThrow(
    'Expected: 1\nReceived: 3',
  );

  logHelper.clearLogs();
  logHelper.expectLogTimes(message, 0);
  logHelper.addLog(message);
  logHelper.expectLogTimes(message, 1);
});

test('should count strings literally and ignore ANSI control characters', () => {
  const logHelper = createLogHelper();
  const message = 'ready [web] (entry.js) .*+?^${}|\\';

  logHelper.addLog(`\u001B[32m${message}\u001B[39m\n${message}`);
  logHelper.expectLogTimes(message, 2);
  logHelper.expectLogTimes('missing', 0);
});

test('should count non-overlapping string matches', () => {
  const logHelper = createLogHelper();
  logHelper.addLog('aaaaa');

  logHelper.expectLogTimes('aa', 2);
  logHelper.expectLogTimes('aaa', 1);
});

test('should count empty strings at each position without looping forever', () => {
  const logHelper = createLogHelper();
  logHelper.expectLogTimes('', 1);

  logHelper.addLog('abc');
  logHelper.expectLogTimes('', 4);
});

test('should preserve regular expression flags and lastIndex when counting', () => {
  const logHelper = createLogHelper();
  logHelper.addLog('READY\nready\nnot ready\n');

  logHelper.expectLogTimes(/^ready$/im, 2);
  const pattern = /ready/gi;
  pattern.lastIndex = 6;

  logHelper.expectLogTimes(pattern, 3);
  logHelper.expectLogTimes(pattern, 3);
  expect(pattern.lastIndex).toBe(6);
});
