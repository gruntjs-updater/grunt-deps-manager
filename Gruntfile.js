/*
 * grunt-deps-manager
 * https://github.com/maxleiko/grunt-deps-manager
 *
 * Copyright (c) 2014 Maxime Tricoire
 * Licensed under the LGPL-3.0 license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        copy: {
            main: {
                expand: true,
                cwd: 'test/fixtures',
                src: '**',
                dest: 'tmp/'
            }
        },

        // Configuration to be run (and then tested).
        deps_manager: {
            main: {
                options: {
                    version: '0.0.42'
                },
                src : [
                    'tmp/foo/**/package.json',
                    'tmp/bar/**/package.json'
                ]
            },
            patterns: {
                options: {
                    version: '0.0.8',
                    pattern: ['pattern-.*', 'should-.*']
                },
                src: ['tmp/**/package.json']
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'deps_manager', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
