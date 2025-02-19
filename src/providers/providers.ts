import * as compileProviders from './compile/index.js';
import * as compiler from '../modules/compiler/index.js';
import * as transpileProviders from './transpile/index.js';

import { LoadCompileOptions, LoadMode, LoadOptions, LoadTranspileOptions } from '../load.interfaces.js';

export interface Providers {
    getCacheDir: (options: LoadCompileOptions[`compileOptions`] | LoadTranspileOptions[`transpileOptions`]) => string;
    getConfig: (options: Partial<LoadOptions>) => LoadCompileOptions['compileOptions'] | LoadTranspileOptions['transpileOptions'];
    load: (options: compiler.CompileOptions | compiler.TranspileOptions) => Promise<void>;
}

export const providersMap = {
    compile: compileProviders,
    transpile: transpileProviders,
} as Record<LoadMode, Providers>;
