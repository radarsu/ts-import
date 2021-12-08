import * as path from 'path';

import { tsImport } from '../src';

test(`process-cwd-collision`, async () => {
    const promises: Promise<any>[] = [];

    const cwd = process.cwd();
    console.log(`cwd`, cwd);

    for (let i = 0; i <= 5; ++i) {
        const tsPath = path.resolve(__dirname, `../__tests-utils__/example${i}.ts`);
        promises.push(tsImport.compile(tsPath, cwd));
    }

    const results = await Promise.all(promises);
    console.log(results);
}, 60000);
