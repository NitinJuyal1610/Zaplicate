import {} from 'fs/promises';
import fs from 'fs';
import path from 'path';

const versionPath = path.join(
  __dirname,
  '../../',
  'backup',
  'metadata',
  'version.txt',
);
export const loadVersion = async () => {
  // Check if version file exists
  try {
    const version = fs.readFileSync(versionPath, 'utf-8');
    return parseInt(version);
  } catch (error) {
    return initializeVersionFile();
  }
};

export const initializeVersionFile = async () => {
  const initialVersion = 1;
  saveVersionFile(initialVersion);
  return initialVersion;
};

export const saveVersionFile = async (version: number) => {
  try {
    fs.writeFileSync(versionPath, version.toString(), 'utf-8');
  } catch (err) {
    console.log('Error: ', err);
  }
};
