import fs from 'fs/promises';
import { hashFile } from './utils/hashUtils';
import { deleteFiles } from './utils/fileUtils';

export const markToDelete = async (
  dirPath: string,
  filteredFiles: string[],
): Promise<string[]> => {
  //calculate hash and mark common for deletion
  const fileHashMapping = new Map();

  //path array
  const markedFiles: string[] = [];

  try {
    for (const file of filteredFiles) {
      const filePath = `${dirPath}/${file}`;
      const hash = await hashFile(filePath);

      if (fileHashMapping.has(hash)) {
        //mark
        markedFiles.push(filePath);
      } else {
        fileHashMapping.set(hash, filePath);
      }
    }
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }

  return markedFiles;
};

//recursive function
export const filterAndListFiles = async (
  dirPath: string,
  filteredFiles: string[],
) => {};
