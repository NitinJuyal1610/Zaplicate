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
    const recursive = false;
    const minSize = parseSizeInput('2B');
    const maxSize = parseSizeInput('1MB');
    const fromDate = new Date('2023-08-22');
    const toDate = new Date('2023-08-23');

    const filterOptions = {
      minSize: minSize,
      maxSize: maxSize,
      fromDate: fromDate,
      toDate: toDate,
    };

    // -e, --extensions <ext1,ext2> Filter files by the specified extensions
    // -x, --exclude <path>        Exclude the specified file or directory from cleanup

    if (!existsSync(dirPath)) {
      console.log('Directory does not exist');
      return;
    }

    // non recursive [Todo : filter logic , preview structure ]
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
      // const markedFiles = await markToDelete(dirPath, filteredFilePaths);

      //display preview
      // -a, --auto  Automatically remove files without preview
      //delete markedFiles on confirmation
      // await deleteFiles(dirPath, markedFiles);
    } else {
      // recursive Case
      //get filtered files from all current state & subdires
      //file names
      const filteredFiles: string[] = [];

      await filterAndListFiles(dirPath, filteredFiles);

      console.log(filteredFiles);

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
