import * as compileProviders from './compile';
import * as compiler from '../modules/compiler';
import * as transpileProviders from './transpile';

import { LoadCompileOptions, LoadMode, LoadOptions, LoadTranspileOptions } from '../load.interfaces';

export interface Providers {
    getCacheDir: (options: LoadCompileOptions[`compileOptions`] | LoadTranspileOptions[`transpileOptions`]) => string;
    getConfig: (options: Partial<LoadOptions>) => LoadCompileOptions['compileOptions'] | LoadTranspileOptions['transpileOptions'];
    load: (options: compiler.CompileOptions | compiler.TranspileOptions) => Promise<void>;
    loadSync: (options: compiler.CompileOptions | compiler.TranspileOptions) => void;
}

export const providersMap = {
    compile: compileProviders,
    transpile: transpileProviders,
} as Record<LoadMode, Providers>;
