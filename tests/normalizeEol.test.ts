import { expect, test } from 'rstack/test';
import { normalizeEol } from '../src/index';

test('should normalize CRLF line endings to LF', () => {
  expect(normalizeEol('first\r\nsecond\nthird\r\n')).toBe(
    'first\nsecond\nthird\n',
  );
});
