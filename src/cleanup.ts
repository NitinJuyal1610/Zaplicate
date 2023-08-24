import fs from 'fs/promises';
import { hashFile } from './utils/hashUtils';
import { filterOptions } from './types/cleanup_types';
import { existsSync } from 'fs';
import path from 'path';
import { getFilesAndDirectories, deleteFiles } from './utils/fileUtils';
import { parseSizeInput } from './utils/generalUtils';

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

//non-recursive
export const filterFiles = async (
  files: string[],
  dirPath: string,
  filterOptions: filterOptions,
) => {
  try {
    const filteredFiles: string[] = [];
    for (const file of files) {
      const filePath = `${dirPath}/${file}`;
      const fileStats = await fs.stat(filePath);
      const modifiedDate = fileStats.mtime.toISOString().substring(0, 10);
      const fileExtension = path.extname(filePath);

      if (
        fileStats.size >= filterOptions.minSize &&
        fileStats.size <= filterOptions.maxSize &&
        modifiedDate >= filterOptions.fromDate.toISOString().substring(0, 10) &&
        modifiedDate <= filterOptions.toDate.toISOString().substring(0, 10) &&
        (filterOptions.extensions.includes(fileExtension) ||
          filterOptions.extensions.includes('*'))
      ) {
        filteredFiles.push(filePath);
      }

      // filter and push files pending
    }
    return filteredFiles;
  } catch (error) {
    throw new Error(`Failed to filter files in ${dirPath}: ${error}`);
  }
};

export const main = async (filterOptions: filterOptions) => {
  try {
    console.log(filterOptions);
    // -x, --exclude <path>        Exclude the specified file or directory from cleanup
    if (!existsSync(filterOptions.dirPath)) {
      console.log('Directory does not exist');
      return;
    }

    // non recursive [Todo : preview structure ]
    if (!filterOptions.recursive) {
      const dirName = path.basename(filterOptions.dirPath);
      // get list of the files
      const { subDirNames, fileNames } = await getFilesAndDirectories(
        filterOptions.dirPath,
      );

      //filter files and directories
      const filteredFilePaths = await filterFiles(
        fileNames,
        filterOptions.dirPath,
        filterOptions,
      );

      const markedFiles = await markToDelete(
        filterOptions.dirPath,
        filteredFilePaths,
      );

      console.log(markedFiles);

      //display preview
      // -a, --auto  Automatically remove files without preview
      //delete markedFiles on confirmation
      // await deleteFiles(filterOptions.dirPath, markedFiles);
    } else {
      // recursive Case
      console.log('Recursive Case');
      //get filtered files from all current state & subdires
      //file names
      const filteredFiles: string[] = [];

      await filterAndListFiles(
        filterOptions.dirPath,
        filteredFiles,
        filterOptions,
      );
      //mark for deletion
      const markedFiles = await markToDelete(
        filterOptions.dirPath,
        filteredFiles,
      );
      console.log(markedFiles);
      //preview
      // -a, --auto                  Automatically remove files without preview
      //delete
      // await deleteFiles(filterOptions.dirPath, markedFiles);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
