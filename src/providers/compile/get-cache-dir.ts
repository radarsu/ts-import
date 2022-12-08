import { LoadCompileOptions } from '../../load.interfaces';

export const getCacheDir = (options: LoadCompileOptions[`compileOptions`]) => {
    return options.compilerOptions.outDir;
};
