import * as path from 'node:path';
import * as tsc from 'typescript';

import { LoadCompileOptions } from '../../load.interfaces';
import { defaults } from 'options-defaults';

const getDefaultCompilerOptions = () => {
    const cwd = process.cwd();
    const defaultsForPlatform: tsc.CompilerOptions & { outDir: string } = {
        outDir: path.join(cwd, `.cache`, `ts-import`),
    };

    if (process.platform === `win32`) {
        const driveLetter = cwd.charAt(0);
        defaultsForPlatform.outDir = path.join(defaultsForPlatform.outDir, driveLetter);
        defaultsForPlatform.rootDir = `${driveLetter}:/`;
    } else {
        defaultsForPlatform.rootDir = `/`;
    }

    return defaultsForPlatform;
};

export const getConfig = (options: LoadCompileOptions) => {
    const defaultCompileOptions: LoadCompileOptions['compileOptions'] & { compilerOptions: { outDir: string } } = {
        // invalidateOnChanges: boolean;
        compilerOptions: {
            ...getDefaultCompilerOptions(),
            downlevelIteration: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            module: tsc.ModuleKind.CommonJS,
            resolveJsonModule: true,
            skipLibCheck: true,
            target: tsc.ScriptTarget.ES2015,
        },
    };

    const compileOptions = defaults(defaultCompileOptions, options);
    return compileOptions;
};
