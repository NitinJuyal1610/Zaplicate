import args from './utils/yargsUtil';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';
import { parseSizeInput } from './utils/generalUtils';
import {
  getFilesAndDirectories,
  filterFiles,
  deleteFiles,
} from './utils/fileUtils';

import { markToDelete, filterAndListFiles } from './cleanup';

import path from 'path';

(async () => {
  try {
    const dirPath = args.dirPath;
    //args demo parameters
    const recursive = true;
    const minSize = parseSizeInput('2B');
    const maxSize = parseSizeInput('1MB');
    const fromDate = new Date('2023-08-22');
    const toDate = new Date('2023-08-23');
    const extensions = ['.txt', '.png', '.js'];

    const filterOptions = {
      minSize: minSize,
      maxSize: maxSize,
      fromDate: fromDate,
      toDate: toDate,
      extensions: extensions,
    };

    // -x, --exclude <path>        Exclude the specified file or directory from cleanup

    if (!existsSync(dirPath)) {
      console.log('Directory does not exist');
      return;
    }

    // non recursive [Todo : preview structure ]
    if (!recursive) {
      const dirName = path.basename(dirPath);
      // get list of the files
      const { subDirNames, fileNames } = await getFilesAndDirectories(dirPath);

      //filter files and directories
      const filteredFilePaths = await filterFiles(
        fileNames,
        dirPath,
        filterOptions,
      );

      console.log(filteredFilePaths);
      const markedFiles = await markToDelete(dirPath, filteredFilePaths);

      //display preview
      // -a, --auto  Automatically remove files without preview
      //delete markedFiles on confirmation
      await deleteFiles(dirPath, markedFiles);
    } else {
      // recursive Case
      //get filtered files from all current state & subdires
      //file names
      const filteredFiles: string[] = [];

      await filterAndListFiles(dirPath, filteredFiles, filterOptions);
      //mark for deletion
      const markedFiles = await markToDelete(dirPath, filteredFiles);
      //preview
      // -a, --auto                  Automatically remove files without preview
      //delete
      await deleteFiles(dirPath, markedFiles);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
