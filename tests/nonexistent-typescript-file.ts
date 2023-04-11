/* eslint-disable id-length */
import * as tsImport from '../src/main.js';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';

const filePath = fileURLToPath(import.meta.url);
const directoryPath = dirname(filePath);

test(`nonexistent-typescript-file`, async (t) => {
    const loading = tsImport.load(`${directoryPath}/assets/file-that-does-not-exist.ts`);

    await t.throwsAsync(loading);
});
