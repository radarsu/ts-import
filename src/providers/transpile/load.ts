import * as compiler from '../../modules/compiler/index.js';

export const load = async (options: compiler.TranspileOptions) => {
    return compiler.transpile(options);
};
