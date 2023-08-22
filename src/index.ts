import args from './utils/yargsUtil';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';
import { getFilesAndDirectories } from './utils/fileUtils';
import { hashFile } from './utils/hashUtils';
import { fileHash } from './types/fileHash_type';
import path from 'path';

(async () => {
  try {
    const dirPath = args.dirPath;
    const structurePath =
      'C:/Users/nitin/OneDrive/Desktop/Dev/FileCleanupAssistant/src/metadata/structure.json';
    const recursive = false;

    if (!existsSync(dirPath)) {
      console.log('Directory does not exist');
      return;
    }

    // non recursive
    if (!recursive) {
      const dirName = path.basename(dirPath);
      // get files Path and file names
      const { subDirNames, fileNames } = await getFilesAndDirectories(dirPath);

      // Work -- Calc Hashes for every filePath using streams and write to json

      const fileHashMapping: fileHash[] = [];
      for (const file of fileNames) {
        const filePath = `${dirPath}/${file}`;
        const hash = await hashFile(filePath);

        fileHashMapping.push({ fileName: file, hash });
      }

      // in non recursive we do not include subdirectories
      const subDirectories = {};
      // write hashes to json
      const fileHandle = await fs.open(structurePath, 'w');

      const heirarchy = {
        dirName: {
          files: fileHashMapping,
          subDirectories: {},
        },
      };

      fileHandle.write(Buffer.from(JSON.stringify(heirarchy)));

      fileHandle.close();
      // rest later
    } else {
      // handle recursive case
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
