import * as os from 'node:os';
import * as path from 'node:path';

import { LoadTranspileOptions } from '../../load.interfaces';
import { defaults } from 'options-defaults';

export const getConfig = (options: LoadTranspileOptions) => {
    const defaultTranspileOptions: LoadTranspileOptions['transpileOptions'] = {
        cache: {
            // invalidateOnChanges: boolean;
            dir: path.join(os.tmpdir(), `ts-import/cache`),
        },
        transpileOptions: {},
    };

    const transpileOptions = defaults(defaultTranspileOptions, options.transpileOptions);
    return transpileOptions;
};
