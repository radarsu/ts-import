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
```ts
import { tsImport } from 'ts-import';

const bootstrap = async () => {
    const filePath = `/home/user/file.ts`;
    const compiled = await tsImport.compile(filePath);
};

bootstrap();
```


## Features
-   **Asynchronous** - uses **import** over **require**.
-   **Caches JavaScript** files into directory inside **node_modules/ts-import/cache** (pretty much like **typescript-require**). Removing node_modules removes cache as well.
-   **Compiler class** - allows making multiple instances of compiler with different configurations and overriding default settings to all of them (i.e. logger) via static "defaults" property: `Compiler.defaults = { ...customDefaults }`. **tsImport** object is a default instance of Compiler class suitable for majority of use-cases.
-   **Fast** - I've benchmarked ways to compare detecting file changes with **fs** module and checking mtimeMs turned out to be fastest (https://jsperf.com/fs-stat-mtime-vs-mtimems).
-   **Highly flexible and configurable** - all **tsc** flags are available for customization. By default uses: `--module commonjs`, `--target es2015`, `--downlevelIteration`, `--emitDecoratorMetadata`, `--experimentalDecorators`, `--resolveJsonModule`.
-   **No interference** - doesn't interfere with native import, require etc. changing their behavior or impacting their performance.
-   **Only 1 dependency** - uses only 1 package maintained by myself (which has 0 dependencies).

