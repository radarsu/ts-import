import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { importJsInDirectory, wasFileModified } from './utils';

import type { Logger } from '@radrat-node/logger';
import { defaults } from 'options-defaults';

export interface CompilerOptions {
    /**
     * If TypeScript compilation fails but there is cached file, should it be loaded? Default: false
     */
    fallback?: boolean;

    /**
     * Flags that should be used during compilation. --rootDir / and --outDir are required.
     */
    flags?: string[];

    /**
     * Logger that will be used by compiler. Requires error, warn, info and debug functions. Default: undefined
     */
    logger?: Partial<Logger>;
}

export interface CompilationContext {
    cwd: string;
    tsPath: string;
    tsDir: string;
}

export class Compiler {
    static defaults = {
        fallback: false,
        flags: [
            `--downlevelIteration`,
            `--emitDecoratorMetadata`,
            `--experimentalDecorators`,
            `--module commonjs`,
            `--resolveJsonModule`,
            `--skipLibCheck`,
            `--target es2015`,
        ],
    };

    options: CompilerOptions & typeof Compiler.defaults;

    constructor(options?: CompilerOptions) {
        this.options = defaults(Compiler.defaults, options);

        if (!this.getFlag(`rootDir`)) {
            this.options.flags.push(`--rootDir /`);
        }

        if (!this.getFlag(`outDir`)) {
            this.options.flags.push(`--outDir '${path.resolve(__dirname, `../cache`)}'`);
        }
    }

    /**
     * Compile scripts.ts to scripts.js, check cache.
     */
    async compile(relativeTsPath = ``, cwd = process.cwd()): Promise<any> {
        // Check if file exists.
        const tsPath = path.resolve(cwd, relativeTsPath);

        if (!fs.existsSync(tsPath)) {
            throw new Error(`File ${tsPath} not found to compile.`);
        }

        // Get file name and directory path.
        const tsDir = path.dirname(tsPath);

        // Create compilation context.
        const ctx: CompilationContext = {
            cwd,
            tsPath,
            tsDir,
        };

        return this.compileOrFail(ctx);
    }

    private async compileOrFail(ctx: CompilationContext) {
        const { logger } = this.options;
        const { tsPath, tsDir, cwd } = ctx;

        const tsFileName = path.basename(tsPath);
        const jsFileName = tsFileName.replace(/\.[^/.]+$/u, `.js`);

        const outDirValue = this.getFlagValue(`outDir`).replace(/'/gu, ``).replace(/"/gu, ``);
        const cacheDir = path.resolve(outDirValue, `.${tsDir}`);
        const jsPath = path.resolve(cacheDir, jsFileName);

        // Check if cached scripts.js exist.
        logger?.verbose?.(`Looking for cached file at ${jsPath}`);
        if (fs.existsSync(jsPath)) {
            // Cache is correct, do nothing.
            const tsWasModified = await wasFileModified(tsPath, jsPath);
            if (!tsWasModified) {
                logger?.verbose?.(`File ${tsPath} was not modified, importing.`);
                return importJsInDirectory(cwd, jsPath, tsDir);
            }

            // Cache is incorrect, rebuild.
            logger?.verbose?.(`File was modified, building and importing.`);
            const buildError = await this.buildCache(tsPath).catch((err) => {
                logger?.warn?.(`Building ${tsPath} failed.`);
                logger?.debug?.(err);
                return err;
            });

            // If we don't want to fallback to last working version of compiled file, throw error.
            if (!this.options.fallback && buildError instanceof Error) {
                throw buildError;
            }

            logger?.verbose?.(`Caching successfull.`);
            return importJsInDirectory(cwd, jsPath, tsDir);
        }

        // Create cache directory if it does not exist.
        if (!fs.existsSync(cacheDir)) {
            logger?.verbose?.(`Creating cache directory.`);
            fs.mkdirSync(cacheDir, {
                recursive: true,
            });
        }

        // Build cache.
        logger?.verbose?.(`File was not cached, caching...`);
        await this.buildCache(tsPath);
        logger?.verbose?.(`Caching successfull.`);
        return importJsInDirectory(cwd, jsPath, tsDir);
    }

    private async buildCache(absoluteTsPath: string) {
        const { flags, logger } = this.options;

        // Compile new scripts.ts to .js.
        return new Promise((resolve, reject) => {
            const compileCommand = `npx -p typescript tsc '${absoluteTsPath}' ${flags.join(` `)}`;
            logger?.info?.(`Compiling ${absoluteTsPath}`);
            logger?.debug?.(`Command: ${compileCommand}`);

            childProcess.exec(compileCommand, (err, stdout, stderr) => {
                if (err) {
                    logger?.error?.(err);
                    reject(err);
                    return;
                }

                if (stdout.trim()) {
                    logger?.debug?.(stdout);
                }

                if (stderr.trim()) {
                    logger?.debug?.(stderr);
                }

                resolve(stdout);
            });
        });
    }

    private getFlag(flagName: string) {
        return this.options.flags.find((flag) => {
            return flag.startsWith(`--${flagName}`);
        });
    }

    private getFlagValue(flagName: string) {
        const selectedFlag = this.getFlag(flagName);

        if (!selectedFlag) {
            throw new Error(`Flag ${flagName} was not found.`);
        }

        const flagParts = selectedFlag.split(` `);
        flagParts.shift();
        return flagParts.join(` `);
    }
}

export const tsImport = new Compiler();
