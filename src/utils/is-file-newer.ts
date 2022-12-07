import * as fs from 'node:fs';

export const isFileNewer = (file1: fs.Stats, file2: fs.Stats) => {
    return file1.mtimeMs > file2.mtimeMs;
};
