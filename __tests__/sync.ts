import * as tsImport from '../src/main';

import { describe, expect, test } from '@jest/globals';

describe(`sync`, () => {
    test(`transpile works`, async () => {
        const loaded = tsImport.loadSync(`${__dirname}/../__tests-utils__/library-using/library-using.ts`);

        expect(loaded.result).toBeTruthy();
    }, 60000);

    test(`compile works`, async () => {
        const loaded = tsImport.loadSync(`${__dirname}/../__tests-utils__/library-using/library-using.ts`, {
            mode: tsImport.LoadMode.Compile,
        });

        expect(loaded.result).toBeTruthy();
    }, 60000);

    test(`compile works`, async () => {
        const loaded = tsImport.loadSync(`${__dirname}/../__tests-utils__/library-using/library-using.ts`, {
            mode: tsImport.LoadMode.Compile,
            compiledJsExtension: `.cjs`,
        });

        expect(loaded.result).toBeTruthy();
    }, 60000);
});
