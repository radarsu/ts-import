import type { Logger } from '@radrat-node/logger';
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
export declare class Compiler {
    static defaults: {
        fallback: boolean;
        flags: string[];
    };
    options: CompilerOptions & typeof Compiler.defaults;
    constructor(options?: CompilerOptions);
    /**
     * Compile scripts.ts to scripts.js, check cache.
     */
    compile(relativeTsPath?: string, cwd?: string): Promise<any>;
    private compileOrFail;
    private buildCache;
    private getFlag;
    private getFlagValue;
}
export declare const tsImport: Compiler;
