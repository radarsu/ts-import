import type { Scripts } from '@radrat/cli';

const scripts: Scripts = async (cli) => {
    await cli.run({
        name: `build`,
        command: [`rm -rf ./dist`, `pnpm exec tsc`].join(` && `),
    });

    // Run tests.
    await cli.run({
        name: `test`,
        command: `pnpm exec jest`,
    });

    await cli.run({
        name: `test.watch`,
        command: `pnpm exec jest --watch`,
    });

    await cli.run({
        name: `publish`,
        command: [
            `pnpm exec rr build`,
            `pnpm publish --access=public`,
            `git init --initial-branch=main`,
            `git remote add origin https://github.com/radarsu/${cli.context.packageJson.name}`,
            `git add .`,
            `git commit -m 'feat: ${cli.context.packageJson.version}'`,
            `git push origin main --force`,
            `rm -rf ./.git`,
        ].join(` && `),
    });
};

export default scripts;