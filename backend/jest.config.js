export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['js'],
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        '*.js',
        '!jest.config.js',
        '!index.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
};