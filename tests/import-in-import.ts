/* eslint-disable id-length */
import * as tsImport from '../src/main.js';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';

const filePath = fileURLToPath(import.meta.url);
const directoryPath = dirname(filePath);

test(`import-in-import`, async (t) => {
    const loaded = await tsImport.load(`${directoryPath}/assets/import-in-import/import-in-import.ts`, {
        mode: tsImport.LoadMode.Compile,
    });

    t.truthy(loaded.result);
});
