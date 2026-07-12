import { expect, test } from 'rstack/test';
import { findFile } from '../src/index';

const files = {
  '/dist/index.abcdef12.js': 'console.log("index")',
  '/dist/styles.css': '.root {}',
};

test('should find a file with a string matcher and ignore its hash', () => {
  expect(findFile(files, 'index.js')).toBe('/dist/index.abcdef12.js');
});

test('should support regular expression and function matchers', () => {
  expect(findFile(files, /styles\.css$/g)).toBe('/dist/styles.css');
  expect(findFile(files, (file) => file.endsWith('index.js'))).toBe(
    '/dist/index.abcdef12.js',
  );
});

test('should throw when no file matches', () => {
  expect(() => findFile(files, 'missing.js')).toThrow(
    'Unable to find file matching "missing.js"',
  );
});
