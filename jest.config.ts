import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api',
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest
      }
    ]
  }
};

export default config;