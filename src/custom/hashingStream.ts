import { Transform, TransformCallback } from 'stream';
import { createHash, Hash, BinaryToTextEncoding } from 'crypto';

export class HashingStream extends Transform {
  private hash: Hash;
  private encoding: BinaryToTextEncoding;
  constructor({
    hashType,
    encoding = 'hex',
  }: {
    hashType: string;
    encoding: BinaryToTextEncoding;
  }) {
    super();
    this.hash = createHash(hashType);
    this.encoding = encoding;
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    this.hash.update(chunk);
    callback(null, chunk);
  }

  _flush(callback: TransformCallback): void {
    this.push(this.hash.digest(this.encoding));
    callback();
  }
}
