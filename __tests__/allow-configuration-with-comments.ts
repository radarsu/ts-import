import * as tsImport from '../src/main';

import { describe, expect, test } from '@jest/globals';

describe(`allow-configuration-with-comments`, () => {
    test(`compile`, async () => {
        const loaded = await tsImport.load(
            `${__dirname}/../__tests-utils__/allow-configuration-with-comments/allow-configuration-with-comments-transpile.ts`,
            {
                allowConfigurationWithComments: true,
            },
        );

        expect(loaded.result).toBeTruthy();
    }, 60000);

    test(`transpile`, async () => {
        const loaded = await tsImport.load(
            `${__dirname}/../__tests-utils__/allow-configuration-with-comments/allow-configuration-with-comments-compile.ts`,
            {
                allowConfigurationWithComments: true,
            },
        );

        expect(loaded.result).toBeTruthy();
    }, 60000);
});
