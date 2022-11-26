import * as path from 'path';
import * as tsImport from '../../src/main';

const result = true;

const importPath = path.resolve(process.cwd(), `__tests-utils__/library-using/library-using.ts`);

const library = tsImport.loadSync(importPath);
console.log(`library`, library);

export { result };
