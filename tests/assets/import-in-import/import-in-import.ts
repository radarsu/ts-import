import * as path from 'node:path';
import * as tsImport from '../../../src/main.js';

const result = true;

const importPath = path.resolve(process.cwd(), `tests/assets/library-using/library-using.ts`);

const library = await tsImport.load(importPath);

export { result };
