/**
 * Convert backslash path separators to POSIX forward slashes.
 */
export const toPosixPath = (filePath: string) => filePath.replaceAll('\\', '/');
