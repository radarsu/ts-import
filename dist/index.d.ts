import type { Logger } from '@radrat-node/logger';
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
export declare class Compiler {
    static defaults: {
        fallback: boolean;
        compilerOptions: {
            downlevelIteration: boolean;
            emitDecoratorMetadata: boolean;
            experimentalDecorators: boolean;
            module: string;
            outDir: string;
            resolveJsonModule: boolean;
            rootDir: string;
            skipLibCheck: boolean;
            target: string;
        };
    };
    options: CompilerOptions & typeof Compiler.defaults;
    constructor(options?: CompilerOptions);
    /**
     * Compile scripts.ts to scripts.js, check cache.
     */
    compile(relativeTsPath?: string, cwd?: string): Promise<any>;
    private compileOrFail;
    private buildCache;
}
export declare const tsImport: Compiler;
