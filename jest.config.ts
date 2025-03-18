import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'text', 'text-summary', 'lcovonly', 'clover'],
  collectCoverageFrom: [
    '**/src/**/**/*.{ts,tsx,js,jsx}',
    '!**/(test|tests)/**/*.{ts,tsx,js,jsx}',
    '!**/__test__/**/*.{ts,tsx,js,jsx}',
    '!**/src/links/**/*.{ts,tsx,js,jsx}',
  ],
  testMatch: [
    '**/test/**/*.test.{ts,tsx,js,jsx}',
  ],
  testPathIgnorePatterns: ['node_modules/'],
  setupFiles: ['./jest.setup.ts'],
  coveragePathIgnorePatterns: [],
  transformIgnorePatterns: ['node_modules/'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  testTimeout: 30000,
};

export default jestConfig;