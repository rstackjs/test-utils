import { readFile } from 'node:fs/promises';
import { waitFor, type WaitForOptions } from './waitFor.js';

/** Wait until a UTF-8 file includes the expected content. */
export const waitForFileContent = async (
  filePath: string,
  expectedContent: string,
  options?: WaitForOptions,
): Promise<void> => {
  await waitFor(async () => {
    try {
      const content = await readFile(filePath, 'utf-8');
      return content.includes(expectedContent);
    } catch {
      return false;
    }
  }, options);
};
