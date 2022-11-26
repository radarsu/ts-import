import * as tsImport from '../src/main';

import { describe, expect, test } from '@jest/globals';

describe(`import-without-cache`, () => {
    test(`works`, async () => {
        const loaded = await tsImport.load(`${__dirname}/../__tests-utils__/library-using/library-using.ts`, {
            useCache: false,
        });

        expect(loaded.result).toBeTruthy();
    }, 60000);
});
