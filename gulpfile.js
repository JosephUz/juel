const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify-es').default;
const streamify = require("gulp-streamify");
const rename = require('gulp-rename');
const cssMin = require('gulp-css');

gulp.task('basic', function () {
    return browserify('./examples/basic/index')
        .bundle()
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(rename({ extname: '.build.min.js' }))
        .pipe(gulp.dest('./examples/basic'));
});

gulp.task('test', function () {
    return browserify('./test/index')
        .bundle()
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(rename({ extname: '.build.min.js' }))
        .pipe(gulp.dest('./test'));
});


gulp.task('mochajs', function () {
    return gulp.src('node_modules/mocha/mocha.js')
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./test'));
});

gulp.task('mochacss', function () {
    return gulp.src('node_modules/mocha/mocha.css')
        .pipe(cssMin())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./test'));
});