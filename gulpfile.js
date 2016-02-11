var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var browserify = require('browserify-incremental');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gutil = require('gulp-util');
var reactify = require('reactify');
var brfs = require('brfs');
var envify = require('envify');

var srcDir = 'src';
var baseDir = 'static';
var distDir = baseDir + '/compiled';
var stylesheetsDir = srcDir + '/css';

var browserifyDone = Promise.resolve();

var browserifyOpts = {
  entries: ['src/application.js'],
  extensions: ['.jsx'],
  transform: [reactify, brfs, envify],
  debug: true,
};
var browserifyCompiler = browserify(browserifyOpts);

gulp.task('css', function() {
  return gulp.src(stylesheetsDir + '/**/*.css').
    pipe(concat('application.css')).
    pipe(sourcemaps.init({loadMaps: true})).
    pipe(gutil.env.production ? cssnano() : gutil.noop()).
    pipe(sourcemaps.write('./')).
    pipe(gulp.dest(distDir)).
    pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
  var stream;

  browserifyDone = new Promise(function(resolve, reject) {
    stream = browserifyCompiler.bundle().
      pipe(source('application.js')).
      pipe(buffer()).
      pipe(sourcemaps.init({loadMaps: true})).
      pipe(gutil.env.production ? uglify() : gutil.noop()).
      pipe(sourcemaps.write('./')).
      pipe(gulp.dest(distDir)).
      pipe(browserSync.reload({stream: true})).
      on('end', resolve).
      on('error', reject);
  });

  return stream;
});

gulp.task('build', ['css', 'js']);

gulp.task('watch', ['browserSync', 'css', 'js'], function() {
  gulp.watch(stylesheetsDir + '/**/*.css', ['css']);
  gulp.watch(srcDir + '/**/*.js', ['js']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: baseDir,
      middleware: function(_req, _res, next) {
        browserifyDone.then(next);
      },
    },
  });
});
