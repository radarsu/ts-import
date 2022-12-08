import * as compiler from '../../modules/compiler';

export const loadSync = (options: compiler.TranspileOptions) => {
    return compiler.transpileSync(options);
};
