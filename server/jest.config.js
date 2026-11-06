// export const moduleFileExtensions = ['js', 'json', 'ts'];
// export const rootDir = 'src';
// export const testRegex = '.*\\.spec\\.ts$';
// export const transform = {
//   '^.+\\.(t|j)s$': 'ts-jest',
// };
// export const collectCoverageFrom = ['**/*.(t|j)s'];
// export const coverageDirectory = '../coverage';
// export const testEnvironment = 'node';


/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  // ⚠️ ключевая строка: маппинг alias для Jest'а во время выполнения
  // rootDir = 'src', значит '@/' -> 'src/'
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};