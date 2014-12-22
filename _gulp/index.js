'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('./tasks', {
    recurse: true
});

// default task
gulp.task('default', ['styles', 'scripts', 'watch-sass', 'watch-js']);

gulp.task('deploy', ['styles', 'scripts']);