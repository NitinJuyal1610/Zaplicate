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

    const subDirNames = [];
    const fileNames = [];

    for await (const file of files) {
      if (file.isFile()) {
        fileNames.push(file.name);
      } else if (file.isDirectory()) {
        subDirNames.push(file.name);
      }
    }

    return { subDirNames, fileNames };
  } catch (err) {
    console.log('Error: ', err);
    throw err;
  }
};
