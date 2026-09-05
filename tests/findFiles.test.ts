import { expect, test } from 'rstack/test';
import { findFiles } from '../src/index';

const files = {
  '/dist/index.abcdef12.js': 'console.log("index")',
  '/dist/nested/index.12345678.js': 'console.log("nested")',
  '/dist/styles.css': '.root {}',
};

test('should return all matching paths for string, regex and function matchers', () => {
  const expected = [
    '/dist/index.abcdef12.js',
    '/dist/nested/index.12345678.js',
  ];

  expect(findFiles(files, 'index.js')).toEqual(expected);
  expect(findFiles(files, /index\.js$/g)).toEqual(expected);
  expect(findFiles(files, (file) => file.endsWith('index.js'))).toEqual(
    expected,
  );
  expect(findFiles(files, 'missing.js')).toEqual([]);
});

test('should match original paths when ignoreHash is false', () => {
  expect(findFiles(files, 'index.js', { ignoreHash: false })).toEqual([]);
  expect(findFiles(files, 'index.abcdef12.js', { ignoreHash: false })).toEqual([
    '/dist/index.abcdef12.js',
  ]);
});
