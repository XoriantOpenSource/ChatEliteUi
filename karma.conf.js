const webpack = require('./webpack.config');

module.exports = function (config) {
  config.set({

    frameworks: ["jasmine"],

    files: [
      'https://code.jquery.com/jquery-1.11.2.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
      {
        pattern: "bundle.test.js"
      }
    ],
    preprocessors: {
      // add webpack as preprocessor
      'bundle.test.js': ['webpack', 'coverage']
    },
    webpack: webpack,

    reporters: ['progress', 'coverage', 'html'],

    htmlReporter: {
      outputDir: 'karma', // where to put the reports  
      templatePath: null, // set if you moved jasmine_template.html 
      focusOnFailures: true, // reports show failures on start 
      namedFiles: false, // name files instead of creating sub-directories 
      pageTitle: "Unit tests", // page title for reports; browser info by default 
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs 
      reportName: 'test report', // report summary filename; browser info by default 
      // experimental 
      preserveDescribeNesting: false, // folded suites stay folded  
      foldAll: false, // reports start folded (only with preserveDescribeNesting) 
    },


    // optionally, configure the reporter
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    singleRun: true,
    browsers: ['ChromeHeadless', 'ChromeHeadlessNoSandbox'], // incase not able to run the chromeheadless mode change this to 'Chrome' only
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  });
};
