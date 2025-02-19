/* eslint-disable id-length */
import * as tsImport from '../src/main.js';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';

const filePath = fileURLToPath(import.meta.url);
const directoryPath = dirname(filePath);

test(`allow-configuration-with-comments-compile`, async (t) => {
    const loaded = await tsImport.load(`${directoryPath}/assets/allow-configuration-with-comments/allow-configuration-with-comments-transpile.ts`, {
        allowConfigurationWithComments: true,
    });

    t.truthy(loaded.result);
});

test(`allow-configuration-with-comments-transpile`, async (t) => {
    const loaded = await tsImport.load(`${directoryPath}/assets/allow-configuration-with-comments/allow-configuration-with-comments-compile.ts`, {
        allowConfigurationWithComments: true,
    });

    t.truthy(loaded.result);
});
