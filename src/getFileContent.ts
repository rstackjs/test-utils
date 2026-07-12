import {
  type FileMatcher,
  findFile,
  type FindFileOptions,
} from './findFile.js';

/**
 * Return the content of the first file that matches the provided matcher.
 */
export const getFileContent = (
  files: Record<string, string>,
  matcher: FileMatcher,
  options?: FindFileOptions,
): string => files[findFile(files, matcher, options)];
