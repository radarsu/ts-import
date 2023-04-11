import { LoadCompileOptions } from '../../load.interfaces.js';

export const getCacheDir = (options: LoadCompileOptions[`compileOptions`]) => {
    return options.compilerOptions.outDir;
};
