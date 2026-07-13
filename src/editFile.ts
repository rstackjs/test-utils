import { readFile, writeFile } from 'node:fs/promises';

export type FileEditor = (content: string) => string | Promise<string>;

/** Edits a file using a sync or async editor function */
export const editFile = async (
  filePath: string,
  editor: FileEditor,
): Promise<void> => {
  const content = await readFile(filePath, 'utf-8');
  await writeFile(filePath, await editor(content));
};
