import args from './utils/yargsUtil';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';
import { getFilesAndDirectories } from './utils/fileUtils';

(async () => {
  const dirPath = args.dirPath;
  const recursive = false;

  if (!existsSync(dirPath)) {
    console.log('Directory does not exist');
    return;
  }

  //non recursive
  if (!recursive) {
    //get files Path and file names
    const { dirPaths, filePaths } = await getFilesAndDirectories(dirPath);

    // Work -- Calc Hashes for every filePath using streams and write to json

    // call function to calculate hashes for every file in curr dir

    // write hashes to json

    // rest later
  } else {
  }
})();
