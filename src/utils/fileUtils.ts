import fs from 'fs';
import path from 'path';

const sourcePath = path.join(__dirname, '../', '../', 'sourceFiles');
const backupRoot = path.join(__dirname, '../../', 'backup/backups');

export const createDir = async (dirPath: string, version: number) => {
  const restPath = path.relative(sourcePath, dirPath);
  const backupLocation = path.join(
    backupRoot,
    `v${version.toString()}`,
    restPath,
  );
  console.log(backupLocation);
  try {
    fs.mkdirSync(backupLocation, { recursive: true });
  } catch (err) {
    console.log('Creating Directory Failed', err);
  }
};
