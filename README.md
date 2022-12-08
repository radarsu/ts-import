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
import * as tsImport from 'ts-import';

const main = async () => {
    const filePath = `/home/user/file.ts`;
    const asyncResult = await tsImport.load(filePath, {
        // allowConfigurationWithComments: false,
    });
    const syncResult = tsImport.loadSync(filePath);
};

void main();
```

### allowConfigurationWithComments

You can define if file should be imported in the default `transpile` mode or `compile` mode by placing a comment on top of the specific file.

Compile mode is slower, but allows the specified file to be part of a complex program - it can import other files etc.

```ts
/**
 * @tsImport
 * { "mode": "compile" }
 */

import { getOtherVariable } from './get-other-variable';

const result = getOtherVariable();

export { result };
```

## Features

-   **Asynchronous and synchronous version** - uses **import** for async and **require** for sync.
-   **Caches JavaScript** files into directory inside **.cache/ts-import**.
-   **Fast** - I've benchmarked ways to compare detecting file changes with **fs** module and checking mtimeMs turned out to be fastest (https://jsperf.com/fs-stat-mtime-vs-mtimems). Also, compilation in version 3 is approximately 10x faster than in version 2.
-   **Highly flexible and configurable** - all compilerOptions are available under transpileOptions parameter.
-   **No interference** - doesn't interfere with native import, require etc. changing their behavior or impacting their performance.
-   **Only 1 dependency** - uses only 1 tiny package maintained by myself (which has 0 dependencies).
