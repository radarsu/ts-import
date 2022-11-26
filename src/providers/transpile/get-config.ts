import * as path from 'path';

import { LoadTranspileOptions } from '../../load.interfaces';
import { defaults } from 'options-defaults';

export const getConfig = (options: LoadTranspileOptions) => {
    const defaultTranspileOptions: LoadTranspileOptions['transpileOptions'] = {
        cache: {
            // invalidateOnChanges: boolean;
            dir: path.resolve(__dirname, `..`, `..`, `..`, `cache`),
        },
        transpileOptions: {},
    };

    if (process.platform === `win32`) {
        const driveLetter = process.cwd().charAt(0);
        defaultTranspileOptions.cache.dir = path.join(defaultTranspileOptions.cache.dir, driveLetter);
    }

    const transpileOptions = defaults(defaultTranspileOptions, options.transpileOptions);
    return transpileOptions;
};
