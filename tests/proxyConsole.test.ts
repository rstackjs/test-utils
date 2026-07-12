import { expect, test } from 'rstack/test';
import { proxyConsole } from '../src/index';

test('should capture formatted console output and restore the method', () => {
  const originalLog = console.log;
  const { logs, restore } = proxyConsole({ types: 'log' });

  try {
    console.log('\u001B[31mhello\u001B[39m', { value: 1 });
  } finally {
    restore();
  }

  expect(logs).toEqual(['hello { value: 1 }']);
  expect(console.log).toBe(originalLog);

  // Calling restore more than once should be safe.
  restore();
  expect(console.log).toBe(originalLog);
});
