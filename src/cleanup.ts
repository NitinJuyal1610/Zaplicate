import fs from 'fs/promises';
import { hashFile } from './utils/hashUtils';
import { filterOptions } from './types/cleanup_types';
import { existsSync } from 'fs';
import path from 'path';
import { getFilesAndDirectories, deleteFiles } from './utils/fileUtils';
import chalk from 'chalk';
import { bytesToSize } from './utils/generalUtils';
import Table from 'cli-table3';
import inquirer from 'inquirer';

//
const displayPreview = async (markedFiles: string[], rootDir: string) => {
  const table = new Table({
    head: [
      chalk.bold.blue('File Path'),
      chalk.bold.blue('Size'),
      chalk.bold.blue('Date Modified'),
    ],
    colWidths: [45, 15, 15],
  });

  for (const filePath of markedFiles) {
    const fileStats = await fs.stat(filePath);
    const modifiedDate = fileStats.mtime.toISOString().substring(0, 10);
    const fileSize = bytesToSize(fileStats.size);

    const relativePath = path.relative(rootDir, filePath);

    table.push([
      chalk.redBright(relativePath),
      chalk.yellowBright(fileSize),
      chalk.green(modifiedDate),
    ]);
  }

  console.log(
    chalk.bold.red('Total File to be cleaned: ').padStart(35),
    markedFiles.length,
  );

  console.log(table.toString());
};

//

const userConfirmation = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to delete these files ?',
    },
  ]);

  return answer.confirm;
};

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
      (filterOptions.extensions.includes(fileExtension) ||
        filterOptions.extensions.includes('*'))
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
    // -x, --exclude <path>  Exclude the specified file or directory from cleanup
    if (!existsSync(filterOptions.dirPath)) {
      console.log('Directory does not exist');
      return;
    }

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

      if (markedFiles.length == 0) {
        console.log(chalk.green('No files to be cleaned 🫗'));
        return;
      }
      //display preview
      if (!filterOptions.auto)
        await displayPreview(markedFiles, filterOptions.dirPath);

      const answer = await userConfirmation();
      if (answer) {
        console.log(chalk.blue('Cleanup in progress... ⏳'));
        // await deleteFiles(filterOptions.dirPath, markedFiles);
        console.log(chalk.green('Cleanup completed Successfully ✅'));
      } else {
        process.exit(1);
      }
    } else {
      // recursive Case
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

      if (markedFiles.length == 0) {
        console.log(chalk.green('No files to be cleaned 🫗'));
        return;
      }

      //preview
      if (!filterOptions.auto)
        await displayPreview(markedFiles, filterOptions.dirPath);

      const answer = await userConfirmation();
      if (answer) {
        console.log(chalk.blue('Cleanup in progress... ⌛'));
        // await deleteFiles(filterOptions.dirPath, markedFiles);
        console.log(
          chalk.green('Cleanup completed Successfully ✅'),
          'Total files cleaned:',
          markedFiles.length,
        );
      } else {
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
