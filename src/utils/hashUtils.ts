import crypto from 'crypto';
import fs from 'fs';
import { HashingStream } from '../custom/hashingStream';

export const hashFile = async (filePath: string): Promise<string> => {
  try {
    //calculate hash
    const readStream = fs.createReadStream(filePath);
    const hashingStream = new HashingStream({
      hashType: 'sha256',
      encoding: 'hex',
    });

    const hasedStream = readStream.pipe(hashingStream);
    console.log(hasedStream);
  } catch (err) {
    console.log('Error: ', err);
    throw err;
  }
  return 'some hash';
};
