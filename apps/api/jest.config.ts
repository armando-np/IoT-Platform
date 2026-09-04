import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@nexaiot/shared$': '<rootDir>/../../packages/shared/src',
    '^@nexaiot/mqtt$': '<rootDir>/../../packages/mqtt/src'
  }
};

export default config;
