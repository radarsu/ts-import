```ts
import { tsImport } from 'ts-import';

const bootstrap = async () => {
    const filePath = `/home/user/file.ts`;
    const compiled = await tsImport.compile(filePath);
};

bootstrap();
```
