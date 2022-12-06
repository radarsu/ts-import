import * as fs from 'node:fs';

export const checkIfFileExists = async (filePath: string) => {
    return fs.promises.stat(filePath);
};

export const checkIfFileExistsSync = (filePath: string) => {
    return fs.statSync(filePath);
};
