/* eslint-env node */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/no-nodejs-modules */

const fs = require('fs');
const path = require('path');
const https = require('https');
const gulp = require('gulp');
const yargs = require('yargs');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const gutil = require('gulp-util');
const forOwn = require('lodash/forOwn');
const git = require('git-rev-sync');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const cloudflare = require('cloudflare');
const BrowserSync = require('browser-sync');
const pify = require('pify');
const config = require('./src/config');
const webpackConfiguration = require('./webpack.config');

const browserSync = BrowserSync.create();
const srcDir = 'src';
const distDir = 'dist';
const stylesheetsDir = path.join(srcDir, 'css');
const highlightStylesheetsDir = 'node_modules/highlight.js/styles';
const staticDir = path.join(srcDir, 'static');
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
  if (yargs.argv.production) {
    process.env.NODE_ENV = 'production';
  }
});

gulp.task('static', () => gulp.
  src([
    path.join(staticDir, '**/*'),
    path.join('node_modules/zeroclipboard/dist/ZeroClipboard.swf'),
  ]).
  pipe(gulp.dest(distDir)),
);

gulp.task('fonts', () => gulp.
  src([
    path.join(
      bowerComponents,
      'inconsolata-webfont/fonts/inconsolata-regular.*',
    ),
    path.join(bowerComponents, 'fontawesome/fonts/fontawesome-webfont.*'),
    path.join(
      bowerComponents,
      'roboto-webfont-bower/fonts/Roboto-{Bold,Regular}-webfont.*',
    ),
  ]).
  pipe(gulp.dest(path.join(distDir, 'fonts'))),
);

gulp.task('css', () => {
  const processors = [cssnext({browsers: cssnextBrowsers})];
  if (gutil.env.production) {
    processors.push(cssnano());
  }

  return gulp.
    src([
      path.join(bowerComponents, 'normalize-css/normalize.css'),
      path.join(highlightStylesheetsDir, 'github.css'),
      path.join(stylesheetsDir, '**/*.css'),
    ]).
    pipe(concat('application.css')).
    pipe(sourcemaps.init({loadMaps: true})).
    pipe(postcss(processors)).
    pipe(sourcemaps.write('./')).
    pipe(gulp.dest(distDir)).
    pipe(browserSync.stream());
});

gulp.task('js', ['env'], () => {
  const productionWebpackConfig = Object.create(webpackConfiguration);
  productionWebpackConfig.plugins = productionWebpackConfig.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      output: {comments: false},
      sourceMap: true,
    }),
  );

  return pify(webpack)(productionWebpackConfig);
});

gulp.task('build', ['static', 'fonts', 'css', 'js']);

gulp.task('syncFirebase', async() => {
  const data = await pify(fs).readFile(
    path.resolve(__dirname, 'config/firebase-auth.json'),
  );
  const firebaseSecret = process.env.FIREBASE_SECRET;
  if (!firebaseSecret) {
    throw new Error('Missing environment variable FIREBASE_SECRET');
  }

  return new Promise((resolve, reject) => {
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
});

gulp.task('dev', ['browserSync', 'static', 'fonts', 'css'], () => {
  gulp.watch(path.join(staticDir, '/**/*'), ['static']);
  gulp.watch(path.join(stylesheetsDir, '**/*.css'), ['css']);
  gulp.watch(path.join(distDir, '*')).on('change', browserSync.reload);
});

gulp.task('browserSync', ['static'], () => {
  const compiler = webpack(webpackConfiguration);
  compiler.plugin('invalid', browserSync.reload);
  browserSync.init({
    server: {
      baseDir: distDir,
      middleware: [
        webpackDevMiddleware(
          compiler,
          {
            lazy: false,
            stats: 'errors-only',
          },
        ),
      ],
    },
  });
});

gulp.task('purgeCache', () =>
  cloudflare({
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY,
  }).zones.purgeCache(
    process.env.CLOUDFLARE_ZONE,
    {purge_everything: true},
  ),
);
