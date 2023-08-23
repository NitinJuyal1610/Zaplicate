import args from './utils/yargsUtil';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';
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
    const recursive = true;

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
      const filteredFilePaths = await filterFiles(fileNames, dirPath);

      const markedFiles = await markToDelete(dirPath, filteredFilePaths);

      //display preview

      //delete markedFiles on confirmation
      await deleteFiles(dirPath, markedFiles);
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
      //delete
      await deleteFiles(dirPath, markedFiles);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
