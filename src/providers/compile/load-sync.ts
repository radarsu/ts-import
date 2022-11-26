import * as compiler from '../../modules/compiler';

export const loadSync = (options: compiler.CompileOptions) => {
    return compiler.compile(options);
};
