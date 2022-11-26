import { LoadTranspileOptions } from '../../load.interfaces';

export const getCacheDir = (options: LoadTranspileOptions[`transpileOptions`]) => {
    return options.cache.dir;
};
