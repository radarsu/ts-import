import * as compiler from '../../modules/compiler';

export const load = async (options: compiler.CompileOptions) => {
    return compiler.compile(options);
};
