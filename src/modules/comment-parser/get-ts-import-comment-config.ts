import * as fs from 'node:fs';
/* @ts-ignore */
const commentParser = await import('comment-parser');

export const getTsImportCommentConfig = async (tsRelativePath: string) => {
    const tsContent = await fs.promises.readFile(tsRelativePath, `utf-8`);
    const comments = commentParser.parse(tsContent);
    const commentConfig = comments
        .map((comment: any) => {
            const metadataTags = comment.tags.filter((tag: any) => {
                return tag.tag === `tsImport`;
            });

            const metadataJsons = metadataTags.map((metadataTag: any) => {
                return JSON.parse(metadataTag.description);
            });

            return metadataJsons;
        })
        .flat();

    return commentConfig[0];
};

export const getTsImportCommentConfigSync = (tsRelativePath: string) => {
    const tsContent = fs.readFileSync(tsRelativePath, `utf-8`);
    const comments = commentParser.parse(tsContent);
    const commentConfig = comments
        .map((comment: any) => {
            const metadataTags = comment.tags.filter((tag: any) => {
                return tag.tag === `tsImport`;
            });

            const metadataJsons = metadataTags.map((metadataTag: any) => {
                return JSON.parse(metadataTag.description);
            });

            return metadataJsons;
        })
        .flat();

    return commentConfig[0];
};
