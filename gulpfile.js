var gulp = require('gulp');
//var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var compass = require('gulp-compass');
var plumber = require('gulp-plumber');

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};


gulp.task('browser-sync', ['sass', 'webpack'], function() {
    bs.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log("\x1b[31m",error.message,"\x1b[0m");
                this.emit('end');
            }}))
        .pipe(sourcemaps.init())
        .pipe(compass({
            config_file: './config.rb',
            css: './css',
            sass: './src/sass',
            image: './img'
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./css'))
        .pipe(bs.stream());
});

gulp.task('webpack', function() {
    return gulp.src('./src/main.js')
    .pipe(plumber({
        errorHandler: function (error) {
            console.log("\x1b[31m",error.message,"\x1b[0m");
            this.emit('end');
        }}))
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./'))
    .pipe(bs.stream());
});
gulp.task("Js-watch", ['webpack'], function() {
     bs.reload();
});
gulp.task('default', ['browser-sync'], function() {
    gulp.watch("./src/sass/*.scss", ['sass']);
    gulp.watch("./src/*.js", ['Js-watch']);
    gulp.watch("./*.html").on('change', bs.reload);
});
