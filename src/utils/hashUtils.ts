import crypto from 'crypto';
import fs from 'fs';
const { finished } = require('node:stream/promises');
import { HashingStream } from '../custom/hashingStream';

export const hashFile = async (filePath: string): Promise<string> => {
  let hash = '';
  try {
    //calculate hash
    const readStream = fs.createReadStream(filePath);
    const hashingStream = new HashingStream({
      hashType: 'sha256',
      encoding: 'hex',
    });

    const hashedStream = readStream.pipe(hashingStream);

    hashedStream.on('data', (chunk) => {
      hash = chunk.toString();
    });

    await finished(hashedStream);
  } catch (err) {
    console.log('Error: ', err);
    throw err;
  }

  return hash;
};
