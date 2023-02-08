import * as path from 'node:path';

import { LoadTranspileOptions } from '../../load.interfaces';
import { defaults } from 'options-defaults';

export const getConfig = (options: LoadTranspileOptions) => {
    const cwd = process.cwd();
    const defaultTranspileOptions: LoadTranspileOptions['transpileOptions'] = {
        cache: {
            // invalidateOnChanges: boolean;
            dir: path.join(cwd, `.cache`, `ts-import`),
        },
        transpileOptions: {},
    };

    const transpileOptions = defaults(defaultTranspileOptions, options.transpileOptions);
    return transpileOptions;
};
