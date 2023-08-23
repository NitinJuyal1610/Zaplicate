import args from './utils/yargsUtil';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';
import {
  getFilesAndDirectories,
  filterFiles,
  deleteFiles,
} from './utils/fileUtils';
import { hashFile } from './utils/hashUtils';

import path from 'path';

(async () => {
  try {
    const dirPath = args.dirPath;
    const recursive = false;

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
      const filteredFiles = await filterFiles(fileNames, dirPath);

      //calculate hash and mark common for deletion
      const fileHashMapping = new Map();

      //path array
      const markedFiles: string[] = [];

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

      console.log(markedFiles);
      //display preview

      //delete markedFiles on confirmation
      await deleteFiles(dirPath, markedFiles);
    } else {
      // handle recursive case
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
