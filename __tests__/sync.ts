import * as tsImport from '../src/main';

import { describe, expect, test } from '@jest/globals';

describe(`sync`, () => {
    test(`works`, async () => {
        const loaded = tsImport.loadSync(`${__dirname}/../__tests-utils__/library-using/library-using.ts`);

        expect(loaded.result).toBeTruthy();
    }, 60000);
});
