module.exports = (config: any) => {
  config.set({
               autoWatch: false,
               browsers: ['ChromeHeadless'],
               colors: true,
               files: [
                 {pattern: 'lib/**/*.ts'}
               ],
               frameworks: ['jasmine', 'karma-typescript'],
               logLevel: config.LOG_INFO,
               port: 9876,
               preprocessors: {
                 'lib/**/!(*spec).ts': ['coverage'],
                 '**/*.ts': ['karma-typescript'] // tslint:disable-line:object-literal-sort-keys
               },
               reporters: ['spec', 'kjhtml'],
               singleRun: true,

               karmaTypescriptConfig: {
                 tsconfig: './tsconfig.json'
               },

               coverageReporter: {
                 dir: 'coverage',
                 reporters: [
                   {type: 'html', subdir: '.'},
                   {type: 'lcov', subdir: '.'}
                 ]
               }
             });
};