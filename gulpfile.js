var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

var srcDir = 'src';
var baseDir = 'static';
var distDir = baseDir + '/compiled';
var stylesheetsDir = srcDir + '/css';

gulp.task('css', function() {
  return gulp.src(stylesheetsDir + '/**/*.css').
    pipe(concat('application.css')).
    pipe(gulp.dest(distDir)).
    pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['browserSync', 'css'], function() {
  gulp.watch(stylesheetsDir + '/**/*.css', ['css']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: baseDir,
    },
  });
});
