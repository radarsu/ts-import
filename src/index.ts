import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { importJsInDirectory, wasFileModified } from './utils';

import { defaults } from 'options-defaults';

export interface Logger {
    verbose: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    time: (label?: string) => void;
    timeEnd: (label?: string) => void;
}

export interface CompilerOptions {
    /**
     * If TypeScript compilation fails but there is cached file, should it be loaded? Default: false
     */
    fallback?: boolean;

    /**
     * Typescript tsconfig.json compilerOptions.
     */
    compilerOptions?: CompilerOptions;

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
        compilerOptions: {
            downlevelIteration: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            module: `commonjs`,
            outDir: path.resolve(__dirname, `../cache`),
            resolveJsonModule: true,
            rootDir: `/`,
            skipLibCheck: true,
            target: `es2015`,
        },
    };

    options: CompilerOptions & typeof Compiler.defaults;

    constructor(options?: CompilerOptions) {
        // Support setting rootDir and outDir on windows from different drives based process.cwd().
        if (process.platform === `win32`) {
            const driveLetter = process.cwd().charAt(0);
            Compiler.defaults.compilerOptions.outDir = path.resolve(
                Compiler.defaults.compilerOptions.outDir,
                driveLetter,
            );
            Compiler.defaults.compilerOptions.rootDir = `${driveLetter}:/`;
        }

        this.options = defaults(Compiler.defaults, options);
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

        // Get file name and directory path. Replace drive letter for Windows.
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

        const tsDirWithoutDriveLetter = tsDir.replace(/^(?<driveLetter>[a-zA-Z]):/u, ``);

        const cacheDir = path.resolve(this.options.compilerOptions.outDir, `.${tsDirWithoutDriveLetter}`);
        const jsPath = path.resolve(cacheDir, jsFileName);

        logger?.verbose?.(`Looking for cached file at ${jsPath}`);

        // Check if cached scripts.js exist.
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
        const { logger } = this.options;

        const tmpTsConfigPath = path.join(
            this.options.compilerOptions.outDir,
            path.dirname(absoluteTsPath).replace(/^(?<driveLetter>[a-zA-Z]):/u, ``),
            `tsconfig-${path.basename(absoluteTsPath)}.tmp.json`,
        );

        await fs.promises.writeFile(
            tmpTsConfigPath,
            JSON.stringify(
                {
                    compilerOptions: this.options.compilerOptions,
                    include: [absoluteTsPath],
                },
                undefined,
                4,
            ),
        );

        // Compile new scripts.ts to .js.
        return new Promise((resolve, reject) => {
            const compileCommand = `npx -p typescript tsc --project "${tmpTsConfigPath}"`;

            logger?.info?.(`Compiling ${absoluteTsPath}`);
            logger?.debug?.(`Command: ${compileCommand}`);

            childProcess.exec(compileCommand, async (err, stdout, stderr) => {
                if (err) {
                    logger?.error?.(err);
                    await fs.promises.rm(tmpTsConfigPath);
                    reject(err);
                    return;
                }

                if (stdout.trim()) {
                    logger?.debug?.(stdout);
                }

                if (stderr.trim()) {
                    logger?.debug?.(stderr);
                }

                await fs.promises.rm(tmpTsConfigPath);
                resolve(stdout);
            });
        });
    }
}

export const tsImport = new Compiler();
