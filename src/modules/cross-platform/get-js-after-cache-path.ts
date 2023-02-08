export const getJsAfterCachePath = (tsPath: string, cwd: string) => {
    return tsPath.replace(cwd, ``);
};
