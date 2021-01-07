import type { Scripts } from '@radrat/cli';

const scripts: Scripts = async (cli) => {
    // Run tests.
    await cli.run({
        name: `test`,
        command: `npx jest`,
        hiddenFromHelp: true,
    });

    await cli.run({
        name: `test.watch`,
        command: `npx jest --watch`,
        hiddenFromHelp: true,
    });

    await cli.loadPlugins([
        {
            name: `@radrat-scripts/package`,
        },
        {
            name: `@radrat-scripts/readme`,
        },
    ]);
};

export default scripts;
