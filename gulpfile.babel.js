/* eslint-env node */
import fs from 'fs';
import https from 'https';
import gulp from 'gulp';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'gulp-cssnano';
import gutil from 'gulp-util';
import forOwn from 'lodash/forOwn';
import git from 'git-rev-sync';
import config from './src/config';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfiguration from './webpack.config';

const browserSync = require('browser-sync').create();
const srcDir = 'src';
const baseDir = 'static';
const distDir = `${baseDir}/compiled`;
const stylesheetsDir = `${srcDir}/css`;
const bowerComponents = 'bower_components';

const cssnextBrowsers = [];
const supportedBrowsers =
  JSON.parse(fs.readFileSync('./config/browsers.json'));
forOwn(supportedBrowsers, (version, browser) => {
  let browserForCssnext = browser;
  if (browser === 'msie') {
    browserForCssnext = 'ie';
  }
  cssnextBrowsers.push(`${browserForCssnext} >= ${version}`);
});

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
  pipe(postcss([cssnext({browsers: cssnextBrowsers})])).
  pipe(gutil.env.production ? cssnano() : gutil.noop()).
  pipe(sourcemaps.write('./')).
  pipe(gulp.dest(distDir)).
  pipe(browserSync.stream())
);

gulp.task('js', ['env'], () => {
  const productionWebpackConfig = Object.create(webpackConfiguration);
  productionWebpackConfig.plugins = productionWebpackConfig.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      output: {comments: false},
      sourceMap: true,
    })
  );

  return new Promise((resolve, reject) => {
    webpack(productionWebpackConfig, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      gutil.log('[webpack:build]', stats.toString({
        colors: true,
      }));

      resolve();
    });
  });
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
      if (res.statusCode === 200) {
        resolve();
      } else {
        res.on('data', reject);
      }
    });

    req.write(data);
    req.end();
  });
}));

gulp.task('dev', ['browserSync', 'fonts', 'css'], () => {
  gulp.watch(`${stylesheetsDir}/**/*.css`, ['css']);
  gulp.watch(`${baseDir}/*`).on('change', browserSync.reload);
});

gulp.task('browserSync', () => {
  const compiler = webpack(webpackConfiguration);
  compiler.plugin('invalid', browserSync.reload);
  browserSync.init({
    server: {
      baseDir,
      middleware: [webpackDevMiddleware(
        compiler,
        {
          lazy: false,
          stats: 'errors-only',
          publicPath: webpackConfiguration.output.publicPath,
        }
      )],
    },
  });
});
