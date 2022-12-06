import * as fs from 'node:fs';
import * as path from 'node:path';
import * as tsc from 'typescript';

export interface TranspileOptions {
    tsPath: string;
    jsPath: string;
    transpileOptions: tsc.TranspileOptions;
}

export const transpile = async (options: TranspileOptions) => {
    const ts = await fs.promises.readFile(options.tsPath);
    const tsTranspiled = tsc.transpileModule(ts.toString(), options.transpileOptions);

    await fs.promises.mkdir(path.dirname(options.jsPath), {
        recursive: true,
    });

    await fs.promises.writeFile(options.jsPath, tsTranspiled.outputText);
};

export const transpileSync = (options: TranspileOptions) => {
    const ts = fs.readFileSync(options.tsPath);
    const tsTranspiled = tsc.transpileModule(ts.toString(), options.transpileOptions);

    fs.mkdirSync(path.dirname(options.jsPath), {
        recursive: true,
    });

    fs.writeFileSync(options.jsPath, tsTranspiled.outputText);
};
