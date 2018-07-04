/*!
 * Karma v2.0.0
 * Copyright (C) 2011-2016 Google, Inc.
 * Licensed under MIT (https://github.com/karma-runner/karma/blob/master/LICENSE)
!*/

const webpack = require('./webpack.config');

module.exports = function (config) {
  config.set({
    /*!
    * Jasmine v3.1.0
    * Copyright (c) 2008-2017 Pivotal Labs 
    * Licensed under MIT (https://github.com/jasmine/jasmine/blob/master/MIT.LICENSE)
    !*/
    /*!
    * Karma-jasmine v1.1.1
    * Copyright (C) 2011-2013 Google, Inc.
    * Licensed under MIT (https://github.com/karma-runner/karma-jasmine/blob/master/LICENSE)
    !*/
    frameworks: ["jasmine"],

    /*!
    * Karma-jquery v0.2.2
    * Copyright (c) 2014 Vladimir Alaev
    * Licensed under MIT (https://github.com/scf2k/karma-jquery/blob/master/LICENSE)
    !*/
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
    /*!
    * Karma-webpack v3.0.0
    * Copyright JS Foundation and other contributors
    * Licensed under MIT (https://github.com/webpack-contrib/karma-webpack/blob/master/LICENSE)
    !*/
    webpack: webpack,

    reporters: ['progress', 'coverage', 'html'],

    /*!
    * Karma-html-reporter v0.2.7
    * Copyright (C) 2011-2013 Vojta Jína and contributors.
    * Licensed under MIT (https://github.com/dtabuenc/karma-html-reporter/blob/master/LICENSE)
    !*/
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

    /*!
    * Karma-coverage v1.1.1
    * Copyright (C) 2011-2013 Google, Inc.
    * Licensed under MIT (https://github.com/karma-runner/karma-coverage/blob/master/LICENSE)
    !*/
    // optionally, configure the reporter
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    /*!
    * Karma-chrome-launcher v2.2.0
    * Copyright (C) 2011-2013 Google, Inc.
    * Licensed under MIT (https://github.com/karma-runner/karma-chrome-launcher/blob/master/LICENSE)
    !*/
    /*!
    * Karma-firefox-launcher v1.1.0
    * Copyright (C) 2011-2013 Google, Inc.
    * Licensed under MIT (https://github.com/karma-runner/karma-firefox-launcher/blob/master/LICENSE)
    !*/
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
