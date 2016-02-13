/* eslint-env node */

var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var browserifyInc = require('browserify-incremental');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gutil = require('gulp-util');
var assign = require('lodash/assign');
var memoize = require('lodash/memoize');
var babelify = require('babelify');
var brfs = require('brfs');
var envify = require('envify');

var srcDir = 'src';
var baseDir = 'static';
var distDir = baseDir + '/compiled';
var stylesheetsDir = srcDir + '/css';

var browserifyImpl;
if (gulp.env.production) {
  browserifyImpl = browserify;
} else {
  browserifyImpl = browserifyInc;
}

var browserifyDone = Promise.resolve();

var browserifyOpts = {
  extensions: ['.jsx'],
  transform: [babelify, brfs, envify],
  debug: true,
};

var buildBrowserifyCompiler = memoize(function(filename) {
  return browserifyImpl(assign(
    {},
    browserifyOpts,
    {
      entries: ['src/' + filename],
      fullPaths: !gulp.env.production,
    }
  ));
});

function buildBrowserifyStream(filename) {
  return new Promise(function(resolve, reject) {
    buildBrowserifyCompiler(filename).bundle().
      pipe(source(filename)).
      pipe(buffer()).
      pipe(sourcemaps.init({loadMaps: true})).
      pipe(gutil.env.production ? uglify() : gutil.noop()).
      pipe(sourcemaps.write('./')).
      pipe(gulp.dest(distDir)).
      on('end', resolve).
      on('error', reject).
      pipe(browserSync.reload({stream: true}));
  });
}

gulp.task('env', function() {
  if (gulp.env.production) {
    process.env.NODE_ENV = 'production';
  }
});

gulp.task('css', function() {
  return gulp.src(stylesheetsDir + '/**/*.css').
    pipe(concat('application.css')).
    pipe(sourcemaps.init({loadMaps: true})).
    pipe(gutil.env.production ? cssnano() : gutil.noop()).
    pipe(sourcemaps.write('./')).
    pipe(gulp.dest(distDir)).
    pipe(browserSync.reload({stream: true}));
});

gulp.task('js', ['env'], function() {
  browserifyDone = buildBrowserifyStream('application.js');
  return browserifyDone;
});

gulp.task('build', ['css', 'js']);

gulp.task('dev', ['browserSync', 'css', 'js'], function() {
  gulp.watch(stylesheetsDir + '/**/*.css', ['css']);
  gulp.watch(srcDir + '/**/*.js{,x}', ['js']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: baseDir,
      middleware: function(_req, _res, next) {
        browserifyDone.then(function() {
          next();
        });
      },
    },
  });
});
