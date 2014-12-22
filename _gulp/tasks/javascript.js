var gulp = require('gulp');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');

gulp.task('scripts', function() {
    
    return gulp.src([
        'src/scripts/vendor/angular/angular.min.js',
        'src/scripts/vendor/angular/angular-devicechecker.js',
        'src/scripts/app.js'
    ])
    .pipe(concat('app.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

// watch task
gulp.task('watch-js', function() {
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // create LiveReload server
    var server = livereload();

    gulp.watch(['dist/scripts/**']).on('change', function(file) {
        server.changed(file.path);
    });
});
