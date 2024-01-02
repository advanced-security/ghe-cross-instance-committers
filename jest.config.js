module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['lib/*', './__tests__/setup/'],
  setupFiles: ['./__tests__/setup/setEnvVars.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
};
