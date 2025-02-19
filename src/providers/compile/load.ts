import * as compiler from '../../modules/compiler/index.js';
import * as fs from 'node:fs';

export const load = async (options: compiler.CompileOptions) => {
    compiler.compile(options);

    const jsWithNormalExtensionPath = options.jsPath.replace(/\.[^/.]+$/u, `.js`);
    await fs.promises.rename(jsWithNormalExtensionPath, options.jsPath);
};
