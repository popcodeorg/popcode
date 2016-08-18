/* eslint-env node */
import fs from 'fs';
import https from 'https';
import gulp from 'gulp';
import concat from 'gulp-concat';
import browserify from 'browserify';
import browserifyInc from 'browserify-incremental';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import gutil from 'gulp-util';
import memoize from 'lodash/memoize';
import brfs from 'brfs-babel';
import babelify from 'babelify';
import envify from 'envify';
import git from 'git-rev-sync';
import config from './src/config';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';

const browserSync = require('browser-sync').create();
const srcDir = 'src';
const baseDir = 'static';
const distDir = `${baseDir}/compiled`;
const stylesheetsDir = `${srcDir}/css`;
const bowerComponents = 'bower_components';

let browserifyImpl;
if (gulp.env.production) {
  browserifyImpl = browserify;
} else {
  browserifyImpl = browserifyInc;
}

let browserifyDone = Promise.resolve();

const browserifyOpts = {
  extensions: ['.jsx'],
  debug: true,
  fullPaths: !gulp.env.production,
};

const buildBrowserifyCompiler = memoize(
  (filename) => browserifyImpl(`src/${filename}`, browserifyOpts).
    transform(brfs).
    transform(babelify.configure({sourceMapRelative: __dirname})).
    transform(envify)
);

function buildBrowserifyStream(filename) {
  return new Promise((resolve, reject) => {
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

gulp.task('env', () => {
  process.env.GIT_REVISION = git.short();
  if (gulp.env.production) {
    process.env.NODE_ENV = 'production';
  }
});

gulp.task('fonts', () => gulp.
  src([
    `${bowerComponents}/inconsolata-webfont/fonts/inconsolata-regular.*`,
    `${bowerComponents}/fontawesome/fonts/fontawesome-webfont.*`,
    `${bowerComponents}/roboto-webfont-bower/fonts/` +
      'Roboto-{Bold,Regular}-webfont.*',
  ]).
    pipe(gulp.dest(`${distDir}/fonts`))
);

gulp.task('css', () => gulp.
  src([
    `${bowerComponents}/normalize-css/normalize.css`,
    `${stylesheetsDir}/**/*.css`,
  ]).
  pipe(concat('application.css')).
  pipe(sourcemaps.init({loadMaps: true})).
  pipe(postcss([cssnext()])).
  pipe(gutil.env.production ? cssnano() : gutil.noop()).
  pipe(sourcemaps.write('./')).
  pipe(gulp.dest(distDir)).
  pipe(browserSync.reload({stream: true}))
);

gulp.task('js', ['env'], () => {
  browserifyDone = buildBrowserifyStream('application.js');
  return browserifyDone;
});

gulp.task('build', ['fonts', 'css', 'js']);

gulp.task('syncFirebase', () => new Promise((resolve, reject) => {
  fs.readFile(`${__dirname}/config/firebase-auth.json`, (err, data) => {
    if (err) {
      reject(err);
    }

    const firebaseSecret = process.env.FIREBASE_SECRET;
    if (!firebaseSecret) {
      reject('Missing environment variable FIREBASE_SECRET');
    }

    const req = https.request({
      hostname: `${config.firebaseApp}.firebaseio.com`,
      path: `/.settings/rules.json?auth=${firebaseSecret}`,
      method: 'PUT',
    }, (res) => {
      if (res.statusCode === 200) { // eslint-disable-line no-magic-numbers
        resolve();
      } else {
        res.on('data', reject);
      }
    });

    req.write(data);
    req.end();
  });
}));

gulp.task('dev', ['browserSync', 'fonts', 'css', 'js'], () => {
  gulp.watch(`${stylesheetsDir}/**/*.css`, ['css']);
  gulp.watch(`${srcDir}/**/*.js{,x}`, ['js']);
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir,
      middleware: (_req, _res, next) => {
        browserifyDone.then(() => {
          next();
        });
      },
    },
  });
});
