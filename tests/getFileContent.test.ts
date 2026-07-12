import { expect, test } from 'rstack/test';
import { getFileContent } from '../src/index';

const files = {
  '/dist/index.abcdef12.js': 'console.log("index")',
  '/dist/styles.css': '.root {}',
};

test('should return the content of the first matching file', () => {
  expect(getFileContent(files, 'index.js')).toBe('console.log("index")');
  expect(getFileContent(files, /styles\.css$/)).toBe('.root {}');
});

test('should forward find options and errors', () => {
  expect(
    getFileContent(files, 'index.abcdef12.js', { ignoreHash: false }),
  ).toBe('console.log("index")');
  expect(() => getFileContent(files, 'missing.js')).toThrow(
    'Unable to find file matching "missing.js"',
  );
});
