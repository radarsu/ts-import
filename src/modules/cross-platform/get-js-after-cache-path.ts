export const getJsAfterCachePath = (tsPath: string) => {
    let jsAfterCachePath = tsPath;

    if (process.platform === `win32`) {
        jsAfterCachePath = tsPath.split(`:`)[1]!;
    }

    return jsAfterCachePath;
};
