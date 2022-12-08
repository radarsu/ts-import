import * as compiler from '../../modules/compiler';
import * as fs from 'node:fs';

export const loadSync = (options: compiler.CompileOptions) => {
    compiler.compile(options);

    const jsWithNormalExtensionPath = options.jsPath.replace(/\.[^/.]+$/u, `.js`);
    fs.renameSync(jsWithNormalExtensionPath, options.jsPath);
};
