export interface fileHash {
  fileName: string;
  hash: string;
}

export interface listCleanUp {
  subDirNames: string[];
  fileNames: string[];
}

export interface filterOptions {
  minSize: number;
  maxSize: number;
  fromDate: Date;
  toDate: Date;
}
