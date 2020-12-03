<p align="center">
    <h1>ts-import</h1>
    <div>Importing TypeScript files dynamically into JavaScript requires additional compilation step, which is troublesome to write for many. Popular **typescript-require** package seems to be obsolete and doesn't allow much customization. Typed alternative to https://github.com/theblacksmith/typescript-require written in TypeScript.</div>
</p>

## Table of contents

1. [Getting Started](#getting-started)

2. [Usage](#usage)

3. [Features](#features)

## Getting Started

`npm i ts-import`

## Usage

### Simple

```ts
import { tsImport } from 'ts-import';

const main = async () => {
    const filePath = `/home/user/file.ts`;
    const compiled = await tsImport.compile(filePath);
};

void main();
```

### Advanced

```ts
import { Compiler } from 'ts-import';

const main = async () => {
    const filePath = `/home/user/workspace/project/src/file.ts`;
    const compiler = new Compiler({
        // Below are default values that compiler works with.

        /**
         * Flags that should be used during compilation. ts-import will add rootDir and outDir if they are not specified. If you use --project tsconfig.json flag, your rootDir and outDir flags will be overriden by ts-import unless you specify them here.
         */
        flags: [
            `--downlevelIteration`,
            `--emitDecoratorMetadata`,
            `--experimentalDecorators`,
            `--module commonjs`,
            `--resolveJsonModule`,
            `--skipLibCheck`,
            `--target es2015`,
        ],

        /**
         * If TypeScript compilation fails but there is cached file, should it be loaded? Default: false
         */
        fallback: false,

        /**
         * Logger that will be used by compiler. Requires error, warn, info and debug functions. Default: undefined
         */
        logger: undefined,
    });
};

void main();
```

## Features

-   **Caches JavaScript** files into directory inside **node_modules/ts-import/cache** (pretty much like **typescript-require**). Removing module removes cache as well.
-   **Fast** - I've benchmarked ways to compare detecting file changes with **fs** module and checking mtimeMs turned out to be fastest (https://jsperf.com/fs-stat-mtime-vs-mtimems).
-   **Asynchronous** - uses **import** over **require** therefore is asynchronous.
-   **Highly flexible and configurable** - all **tsc** flags are available for customization. By default uses: `--module commonjs`, `--target es2015`, `--downlevelIteration`, `--emitDecoratorMetadata`, `--experimentalDecorators`, `--resolveJsonModule` which allow great amount of features.
-   **Compiler class** - allows making multiple instances of compiler with different configurations and overriding default settings to all of them (i.e. logger) via static "defaults" property: `Compiler.defaults = { ...customDefaults }`. **tsImport** object is a default instance of Compiler class suitable for majority of use-cases.
-   **No interference** - doesn't interfere with native import, require etc. changing their behavior or impacting their performance.
