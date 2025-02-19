import * as commentParser from './modules/comment-parser/index.js';
import * as crossPlatform from './modules/cross-platform/index.js';
import * as path from 'node:path';
import * as url from 'node:url';
import * as utils from './utils/index.js';

import { LoadMode, LoadOptions } from './load.interfaces.js';

import { defaults } from 'options-defaults';
import { providersMap } from './providers/providers.js';

export const load = async (tsRelativePath: string, options?: LoadOptions) => {
    if (options?.allowConfigurationWithComments) {
        const commentConfig = await commentParser.getTsImportCommentConfig(tsRelativePath);
        options = defaults(options, commentConfig);
    }

    const loadConfig = defaults({
        // Default options.
        mode: LoadMode.Transpile,
        allowConfigurationWithComments: false,
        useCache: true,
        compiledJsExtension: `.mjs`,
    }, options);

    const provider = providersMap[loadConfig.mode];
    const config = provider.getConfig(loadConfig);

    const cwd = process.cwd();
    const cacheDir = provider.getCacheDir(config);

    const tsPath = path.resolve(cwd, tsRelativePath);
    const jsAfterCachePath = crossPlatform.getJsAfterCachePath(tsPath);
    const jsPath = path.join(cacheDir, jsAfterCachePath).replace(/\.[^/.]+$/u, loadConfig.compiledJsExtension);

    if (loadConfig.useCache) {
        const [tsFileExists, jsFileExists] = await Promise.all([
            utils.checkIfFileExists(tsPath),
            utils.checkIfFileExists(jsPath).catch(() => {
                // * Ignore non-existent cache.
            }),
        ]);

        // Load from cache.
        if (jsFileExists && !utils.isFileNewer(tsFileExists, jsFileExists)) {
            const fileUrl = url.pathToFileURL(jsPath).href;
            const loaded = await import(fileUrl);
            return loaded;
        }
    }

    await provider.load({
        tsPath,
        jsPath,
        ...config,
    });

    const fileUrl = url.pathToFileURL(jsPath).href;
    const loaded = await import(fileUrl);
    return loaded;
};

export * from './load.interfaces.js';
