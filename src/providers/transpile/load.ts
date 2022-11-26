import * as compiler from '../../modules/compiler';

export const load = async (options: compiler.TranspileOptions) => {
    return compiler.transpile(options);
};
