module.exports = {
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'js'],
  restoreMocks: true,
  roots: ['<rootDir>/lib'],
  setupFiles: [],
  testRegex: '(.*\\.spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
