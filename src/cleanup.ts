import fs from 'fs/promises';
import { hashFile } from './utils/hashUtils';
import { deleteFiles } from './utils/fileUtils';
import { getFilesAndDirectories } from './utils/fileUtils';
import { filterOptions } from './types/cleanup_types';
import path from 'path';

export const markToDelete = async (
  dirPath: string,
  filteredFiles: string[],
): Promise<string[]> => {
  //calculate hash and mark common for deletion
  const fileHashMapping = new Map();

  //path array
  const markedFiles: string[] = [];

  try {
    for (const filePath of filteredFiles) {
      const hash = await hashFile(filePath);

      if (
        fileHashMapping.has(hash) &&
        path.dirname(fileHashMapping.get(hash)) === path.dirname(filePath)
      ) {
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
  filterOptions: filterOptions,
) => {
  const { subDirNames, fileNames } = await getFilesAndDirectories(dirPath);
  //base case

  //filter and push
  for (const file of fileNames) {
    const filePath = `${dirPath}/${file}`;
    const fileStats = await fs.stat(filePath);
    const modifiedDate = fileStats.mtime.toISOString().substring(0, 10);
    const fileExtension = path.extname(filePath);

    if (
      fileStats.size >= filterOptions.minSize &&
      fileStats.size <= filterOptions.maxSize &&
      modifiedDate >= filterOptions.fromDate.toISOString().substring(0, 10) &&
      modifiedDate <= filterOptions.toDate.toISOString().substring(0, 10) &&
      filterOptions.extensions.includes(fileExtension)
    ) {
      filteredFiles.push(filePath);
    }
  }
  //for every subfolder call this function again
  for (const subDir of subDirNames) {
    const subDirPath = `${dirPath}/${subDir}`;
    await filterAndListFiles(subDirPath, filteredFiles, filterOptions);
  }

  return;
};
