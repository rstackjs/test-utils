/** Normalize CRLF line endings to LF. */
export const normalizeEol = (content: string): string =>
  content.replaceAll('\r\n', '\n');
