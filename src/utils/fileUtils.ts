import fs from 'fs/promises';
import { filterOptions, listCleanUp } from '../types/cleanup_types';
import path from 'path';

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

export const createFile = async (filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content);
  } catch (error) {
    throw new Error(`Failed to create file at ${filePath}: ${error}`);
  }
};

export const deleteFiles = async (parentPath: string, files: string[]) => {
  try {
    // Implementation to delete files
    files.forEach(async (file) => {
      await fs.unlink(file);
    });
    console.log('Cleanup completed Successfully!');
  } catch (error) {
    throw new Error(`Failed to delete files in ${parentPath}: ${error}`);
  }
};

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
        filterOptions.extensions.includes(fileExtension)
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
