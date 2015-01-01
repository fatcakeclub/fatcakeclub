'use strict';

var matchdep = require('matchdep');

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        'Gruntfile.js',
        'app.js',
        'bin/www',
        'routes/**/*.js',
        'public/javascripts/**/*.js'
      ]
    },
    jsonlint: {
      configs: {
        src: [
          'bower.json',
          'package.json',
          'config/**/*.json'
        ]
      }
    },
    lintspaces: {
      src: [
        'bin/www',
        'app.js',
        'public/javascripts/**/*.js',
        'public/stylesheets/**/*.scss',
        'routes/**/*.js',
        'views/**/*.hjs',
      ],
      options: {
        newlineMaximum: 2,
        trailingspaces: true,
        indentation: 'spaces',
        spaces: 2
      }
    },
    compass: {
      all: {
        options: {
          sourcemap: true,
          sassDir: 'public/stylesheets',
          cssDir: 'public/stylesheets'
        }
      }
    },
    clean: {
      dist: [
        'node_modules',
        'public/components',
        'public/stylesheets/style.css*',
        'public/.sass-cache/'
      ]
    },
    watch: {
      js: {
        files: [
          'app.js',
          'routes/**/*.js',
          'config/**/*.json',
          'bin/www'
        ],
        tasks: ['develop'],
      },
      sass: {
        files: 'public/stylesheets/**/*.scss',
        tasks: ['compass']
      }
    },
    develop: {
      server: {
        file: 'bin/www',
        env: {
          NODE_ENV: 'development',
          DEBUG: 'fatcakeclub'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'jsonlint',
    'lintspaces',
    'compass'
  ]);

  grunt.registerTask('clean', ['cleandist']);

  grunt.registerTask('dev', [
    'develop',
    'watch'
  ]);

  matchdep.filterDev('grunt-*', './package.json')
    .forEach(grunt.loadNpmTasks);
};