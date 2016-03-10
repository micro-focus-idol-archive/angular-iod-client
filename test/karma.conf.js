// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-06-08 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/underscore/underscore-min.js',
            'bower_components/momentjs/moment.js',

            'src/models/http/req-query-params.js',
            'src/models/http/statistics/statistics-query-params.js',
            'src/iod-client.module.js',
            'src/**/*.js',
	        'bower_components/underscore/underscore-min.js',

            // test code
            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        reporters:['coverage'],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS', 'Chrome', 'ChromeCanary', 'Firefox', 'IE'],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-coverage',
            'karma-junit-reporter',
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
