'use strict';

// load in gulp
var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    cache         = require('gulp-cache'),
    connect       = require('gulp-connect'),
    csso          = require('gulp-csso'),
    gulpif        = require('gulp-if'),
    flatten       = require('gulp-flatten'),
    imagemin      = require('gulp-imagemin'),
    jshint        = require('gulp-jshint'),
    minifyHtml    = require('gulp-minify-html'),
    ngAnnotate    = require('gulp-ng-annotate'),
    notify        = require('gulp-notify'),
    rev           = require('gulp-rev'),
    rimraf        = require('gulp-rimraf'),
    sass          = require('gulp-ruby-sass'),
    size          = require('gulp-size'),
    sprite        = require('css-sprite').stream,
    stylish       = require('jshint-stylish'),
    uglify        = require('gulp-uglify'),
    uncss         = require('gulp-uncss'),
    useref        = require('gulp-useref'),
    wiredep       = require('wiredep').stream;


// CREATE LOCAL SERVER
gulp.task('connect', ['styles', 'wiredep'], function () {
    connect.server({
        root: './app',
        port: 8001,
        livereload: true,
        middleware: function (connect) {
            return [
                connect().use(
                    '/bower_components', connect.static('./bower_components')
                ),
                connect().use(
                    '/styles', connect.static('./dist/styles')
                )
            ];
        }
    });

    gulp.watch([
        'app/*.html',
        'app/views/**/*',
        'app/scripts/**/*.js',
        'app/styles/**/*.scss',
        'app/images/**/*'
    ], [
        'linting',
        'styles'
    ]);
});

// CLEAN DIST DIRECTORY
gulp.task('clean', function () {
    gulp.src('./dist', { read: false }) // much faster
        .pipe(rimraf());
});

// COMPILE CSS
gulp.task('styles', function () {
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 5 version'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(connect.reload());
});

// INJECT BOWER COMPONENTS
gulp.task('wiredep', function () {
    return gulp.src('app/*.html')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest('app'));
});

// MINIFY ALL ASSETS
// this task will call 'wiredep' to make sure all assets
// are present at time of compilation
gulp.task('minify', ['wiredep'], function () {
    var assets = useref.assets({searchPath: [
      '.tmp',
      'app',
      '.'
    ]});

    gulp.src('./app/favicon.ico')
        .pipe(flatten())
        .pipe(gulp.dest('./dist'));

    gulp.src('./app/views/*.html')
        .pipe(flatten())
        .pipe(gulp.dest('./dist/views/'));

    return gulp.src('./app/*.html')
        .pipe(assets)
        .pipe(ngAnnotate())
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', minifyHtml({
            conditionals: true,
            loose: true
        })))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

// LINTING
gulp.task('linting', function () {
    return gulp.src('./app/{,*/}*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

// UNCSS
// this task will call 'styles' to make sure CSS
// has been created at time of compilation
gulp.task('uncss', ['styles'], function () {
    gulp.src('./dist/styles/main.css')
        .pipe(uncss({
            html: [
              './app/*.html',
              './app/views/**/*.html'
            ]
        }))
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest('./dist/styles'));
});


// image minification task
gulp.task('imagemin', ['minify'], function () {
    return gulp.src(['./app/images/**/*.{gif,jpg,png,svg}', '!./app/images/sprite/src-2x/**'])
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        })))
        .pipe(gulp.dest('./dist/images'));
});

// FILE REVISIONING
gulp.task('revision', function () {
    return gulp.src('./dist/**/*.*')
        .pipe(rev())
        .pipe(gulp.dest('dist'));
});

// SPRITE GENERATION
gulp.task('clean-sprites', function () { // clean...
    return gulp.src('app/images/sprite/*.png', {read: false})
        .pipe(rimraf());
});

gulp.task('sprites', ['clean-sprites'], function () { // ...then generate
    return gulp.src('app/images/sprite/src-2x/*.png')
        .pipe(sprite({
            name: 'spritesheet-' + new Date().getTime(),
            style: '_spritesheet.scss',
            cssPath: '../images/sprite/',
            processor: 'scss',
            orientation: 'binary-tree',
            margin: 2,
            retina: true,
            prefix: 'sprite'
        }))
        .pipe(gulpif('*.png', gulp.dest('./app/images/sprite/'), gulp.dest('./app/styles/base/')));
});

gulp.task('copy', function(){

});

// file rev
// tests
// phantom

// BUILD TASK
// clean: deletes existing dist folder
// uncss: compile CSS and removes unused CSS selectors from distibution file
// minify: insert all Bower assets and compile them
gulp.task('build', ['clean', 'uncss', 'minify', 'imagemin', 'copy'], function () {
    return gulp.src('dist/**/*').pipe(size({
        title: 'build',
        gzip: true
    }))
    .pipe(notify({
        message: 'build complete'
    }));
});

// DEV TASK
// clean: deletes existing dist folder
// styles: compile CSS
// minify: insert all Bower assets and compile them
// linting: check JavaScript for errors
// connect: runs local server
gulp.task('default', ['connect', 'linting']);
