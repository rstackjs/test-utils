import { expect, test } from 'rstack/test';
import { toPosixPath } from '../src/index';

test('should convert backslash path separators to forward slashes', () => {
  expect(toPosixPath('C:\\project\\src\\index.ts')).toBe(
    'C:/project/src/index.ts',
  );
  expect(toPosixPath('/project/src/index.ts')).toBe('/project/src/index.ts');
});
