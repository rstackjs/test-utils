export type FileMatcher = string | RegExp | ((file: string) => boolean);

export type FindFileOptions = {
  /**
   * Whether to ignore a content hash in the filename.
   * @default true
   */
  ignoreHash?: boolean;
};

const HASH_PATTERN = /\.[0-9a-z]{8,}(?=\.)/gi;

const toMatcher = (matcher: FileMatcher): ((file: string) => boolean) => {
  if (typeof matcher === 'function') {
    return matcher;
  }
  if (typeof matcher === 'string') {
    return (file) => file.endsWith(matcher);
  }

  const regexp = new RegExp(matcher.source, matcher.flags);
  return (file) => {
    regexp.lastIndex = 0;
    return regexp.test(file);
  };
};

/**
 * Find the first file path that matches the provided matcher.
 */
export const findFile = (
  files: Record<string, string>,
  matcher: FileMatcher,
  options: FindFileOptions = {},
): string => {
  const { ignoreHash = true } = options;
  const matcherFn = toMatcher(matcher);

  for (const file of Object.keys(files)) {
    const comparableFile = ignoreHash ? file.replace(HASH_PATTERN, '') : file;
    if (matcherFn(comparableFile)) {
      return file;
    }
  }

  throw new Error(`Unable to find file matching "${matcher.toString()}"`);
};
