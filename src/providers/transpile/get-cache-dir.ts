import { LoadTranspileOptions } from '../../load.interfaces.js';

export const getCacheDir = (options: LoadTranspileOptions[`transpileOptions`]) => {
    return options.cache.dir;
};
