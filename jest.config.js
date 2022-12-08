module.exports = {
    transform: {
        '^.+\\.ts$': `ts-jest`,
    },
    testRegex: `(/__tests__/.*|(\\.|/)(spec))\\.ts$`,
};
