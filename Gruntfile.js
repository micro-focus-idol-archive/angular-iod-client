'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var appConfig = {
		app: 'src',
		dist: 'dist'
	};
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-ngdocs');
	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			js: {
				files: ['<%= config.app %>/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			styles: {
				files: ['<%= config.app %>/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729,
				keepalive: true
			},
			docs:{
				server:{}
			},
			livereload: {
				options: {
					open: true,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			test: {
				options: {
					port: 9001,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect.static('test'),
							connect().use('/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= config.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%= config.app %>/scripts/{,*/}*.js'
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'docs',
						'<%= config.dist %>/{,*/}*',
						'!<%= config.dist %>/.git{,*/}*'
					]
				}]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},

		concat: {
			dist: {
				options: {
					stripBanners: true,
					banner: "'use strict';\n",
					sourceMap: true
				}, files: {
					'<%= config.dist %>/angular-iod-client.js': ['src/iod-client.module.js', 'src/**/*.js']
				}
			},
			temp: {
				options: {
					stripBanners: true,
					banner: "'use strict';\n",
					sourceMap: true
				}, files: {
					'.tmp/concat/scripts/basic.js': ['src/iod-client.module.js', 'src/**/*.js']
				}
			}

		},
		// ng-annotate tries to make the code safe for minification automatically
		// by using the Angular long form for dependency injection.
		ngAnnotate: {

			dist: {
				options: {
					add: true,
					singleQuotes: true
				},
				files: [{
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: ['*.js', '!oldieshim.js'],
					dest: '.tmp/ngAnnotate/scripts'
				}]
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= config.dist %>/angular-iod-client.min.js': ['.tmp/ngAnnotate/scripts/basic.js']
				}
			}
		},


		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'images/{,*/}*.{webp}',
						'fonts/{,*/}*.*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= config.dist %>/images',
					src: ['generated/*']
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= config.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'copy:styles',
				'imagemin',
				'svgmin'
			]
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'test/karma.conf.js',
				singleRun: true,
				reporters: ['coverage', 'junit'],
				browsers: ['PhantomJS'],
				junitReporter: {
					outputFile: 'reports/test-results.xml'
				},
				coverageReporter: {
					type: 'html',
					dir: 'reports/test-coverage/'
				}
			}
		},

		//project inline src documentation
		ngdocs: {
			options: {
				scripts: ['angular.js'],
				html5Mode: false
			},
			all: ['src/**/*.js']
		}
	});

	grunt.registerTask('test', [
		'clean:server',
		'autoprefixer',
		'connect:test',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'concat',
		'ngAnnotate',
		'uglify'
	]);

	grunt.registerTask('travis', [
		'test',
		'build'
	]);

	grunt.registerTask('default', [
		'test',
		'build'
	]);

	grunt.registerTask('buildDocs',['ngdocs', 'connect:docs'])
};
