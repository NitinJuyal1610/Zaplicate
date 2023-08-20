import fs from 'fs/promises';
import { existsSync } from 'node:fs';
import { listCleanUp } from '../types/list_type';

export const getFilesAndDirectories = async (
  dirPath: string,
): Promise<listCleanUp> => {
  try {
    const files = await fs.readdir(dirPath, {
      withFileTypes: true,
      recursive: true,
      encoding: 'utf-8',
    });

    const dirPaths = [];
    const filePaths = [];

    for await (const file of files) {
      const filePath = `${dirPath}/${file.name}`;
      if (file.isFile()) {
        filePaths.push(filePath);
      } else if (file.isDirectory()) {
        dirPaths.push(filePath);
      }
    }

    return { dirPaths, filePaths };
  } catch (err) {
    console.log('Error: ', err);
    throw err;
  }
};
