import * as tsImport from '../src/main';

import { describe, expect, test } from '@jest/globals';

describe(`unexisting-typescript-file`, () => {
    test(`works`, async () => {
        const loading = tsImport.load(`${__dirname}/../__tests-utils__/file-that-does-not-exist.ts`);

        await expect(loading).rejects.toThrow();
    }, 60000);
});
