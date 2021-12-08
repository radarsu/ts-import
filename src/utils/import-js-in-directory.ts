export const importJsInDirectory = async (cwd: string, jsPath: string, importDirectory: string) => {
    process.chdir(importDirectory);
    const compiled = await import(jsPath);
    process.chdir(cwd);
    return compiled;
};
