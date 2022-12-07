import * as commentParser from './modules/comment-parser';
import * as crossPlatform from './modules/cross-platform';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as utils from './utils';

import { LoadMode, LoadOptions } from './load.interfaces';

import { defaults } from 'options-defaults';
import { providersMap } from './providers/providers';

export const defaultLoadOptions = {
    mode: LoadMode.Transpile,
    allowConfigurationWithComments: false,
    useCache: true,
};

export const load = async (tsRelativePath: string, options?: LoadOptions) => {
    if (options?.allowConfigurationWithComments) {
        const commentConfig = await commentParser.getTsImportCommentConfig(tsRelativePath);
        options = defaults(options, commentConfig);
    }

    const loadConfig = defaults(defaultLoadOptions, options);
    const providers = providersMap[loadConfig.mode];
    const config = providers.getConfig(loadConfig);

    const cwd = process.cwd();
    const cacheDir = providers.getCacheDir(config);

    const tsPath = path.resolve(cwd, tsRelativePath);
    const jsAfterCachePath = crossPlatform.getJsAfterCachePath(tsPath);
    const jsPath = path.join(cacheDir, jsAfterCachePath).replace(/\.[^/.]+$/u, `.js`);

    if (loadConfig.useCache) {
        const [tsFileExists, jsFileExists] = await Promise.all([
            utils.checkIfFileExists(tsPath),
            utils.checkIfFileExists(jsPath).catch(() => {
                // * Ignore non-existent cache.
            }),
        ]);

        // Load from cache.
        if (jsFileExists && !utils.isFileNewer(tsFileExists, jsFileExists)) {
            const loaded = await import(jsPath);
            return loaded;
        }
    }

    await providers.load({
        tsPath,
        jsPath,
        ...config,
    });

    const loaded = await import(jsPath);
    return loaded;
};

export const loadSync = (tsRelativePath: string, options?: LoadOptions) => {
    if (options?.allowConfigurationWithComments) {
        const commentConfig = commentParser.getTsImportCommentConfigSync(tsRelativePath);
        options = defaults(options, commentConfig);
    }

    const loadConfig = defaults(defaultLoadOptions, options);
    const providers = providersMap[loadConfig.mode];
    const config = providers.getConfig(loadConfig);

    const cwd = process.cwd();
    const cacheDir = providers.getCacheDir(config);
    const tsPath = path.resolve(cwd, tsRelativePath);

    const jsAfterCachePath = crossPlatform.getJsAfterCachePath(tsPath);
    const jsPath = path.join(cacheDir, jsAfterCachePath).replace(/\.[^/.]+$/u, `.js`);

    if (loadConfig.useCache) {
        const tsFileExists = utils.checkIfFileExistsSync(tsPath);
        let jsFileExists: fs.Stats | undefined;

        try {
            jsFileExists = utils.checkIfFileExistsSync(jsPath);
        } catch (err) {
            // * Ignore non-existent cache.
        }

        // Load from cache.
        if (jsFileExists && !utils.isFileNewer(tsFileExists, jsFileExists)) {
            // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires
            const loaded = require(jsPath);
            return loaded;
        }
    }

    providers.loadSync({
        tsPath,
        jsPath,
        ...config,
    });

    // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires
    const loaded = require(jsPath);
    return loaded;
};

export * from './load.interfaces';
