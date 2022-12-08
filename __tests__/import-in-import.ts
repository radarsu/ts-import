import * as tsImport from '../src/main';

import { describe, expect, test } from '@jest/globals';

describe(`import-in-import`, () => {
    test(`works`, async () => {
        const loaded = await tsImport.load(`${__dirname}/../__tests-utils__/import-in-import/import-in-import.ts`, {
            mode: tsImport.LoadMode.Compile,
        });

        expect(loaded.result).toBeTruthy();
    }, 60000);
});
