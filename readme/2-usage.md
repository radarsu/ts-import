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