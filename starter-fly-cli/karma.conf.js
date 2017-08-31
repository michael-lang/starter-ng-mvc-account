// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
	  require('karma-electron'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
	  require('karma-junit-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
	  codeCoverage: config.angularCli && config.angularCli.codeCoverage,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
	files: [
	  { pattern: './src/test.ts', watched: false },
	  //material needs a theme or it will complain (doesn't matter which one)
	  { pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css', included: true, watched: true }
	],
	preprocessors: [
	  './src/test.ts': ['@angular/cli']
	],
	mime: [
	  'text/x-typescript': ['ts', 'tsx']
	],
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly', 'cobertura', 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
	  ? ['progress', 'junit', 'coverage-istanbul']
	  : ['progress', 'kjhtml'],
	junitReporter: [
	  outputDir: 'coverage/karma',
	  outputFile: 'karma-results.junit.xml'
	],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
