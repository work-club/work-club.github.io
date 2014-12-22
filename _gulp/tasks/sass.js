
// load in plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');

// styles task
gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 5 version'))
        .pipe(gulp.dest('dist/styles/'));
});


// watch task
gulp.task('watch-sass', function() {

    // watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // create LiveReload server
    var server = livereload();

    // watch any files in public/, reload on change
    gulp.watch(['dist/styles/**']).on('change', function(file) {
        server.changed(file.path);
    });
});
