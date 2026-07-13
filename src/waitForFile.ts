import { existsSync } from 'node:fs';
import { waitFor, type WaitForOptions } from './waitFor.js';

/** Wait until a file path exists. */
export const waitForFile = async (
  filePath: string,
  options?: WaitForOptions,
): Promise<void> => {
  await waitFor(() => existsSync(filePath), options);
};
