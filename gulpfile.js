const fs = require('fs');
const https = require('https');
const path = require('path');

const BrowserSync = require('browser-sync');
const cloudflare = require('cloudflare');
const cssnano = require('cssnano');
const gulp = require('gulp');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const isDocker = require('is-docker');
const forOwn = require('lodash.forown');
const pify = require('pify');
const postcssPresetEnv = require('postcss-preset-env');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('./src/config');
const webpackConfiguration = require('./webpack.config');

const browserSync = BrowserSync.create();
const srcDir = 'src';
const distDir = 'dist';
const stylesheetsDir = path.join(srcDir, 'css');
const highlightStylesheetsDir = 'node_modules/highlight.js/styles';
const codemirrorStylesheets = [
  'node_modules/codemirror/lib/codemirror.css',
  'node_modules/codemirror/addon/lint/lint.css',
];
const staticDir = path.join(srcDir, 'static');
const bowerComponents = 'bower_components';

const postcssBrowsers = [];
const supportedBrowsers = JSON.parse(
  fs.readFileSync('./config/browsers.json').toString(),
);
forOwn(supportedBrowsers, (version, browser) => {
  let browserForPostcss = browser;
  if (browser === 'msie') {
    browserForPostcss = 'ie';
  }
  postcssBrowsers.push(`${browserForPostcss} >= ${version}`);
});

gulp.task('static', () =>
  gulp.src(path.join(staticDir, '**/*')).pipe(gulp.dest(distDir)),
);

gulp.task('css', () => {
  const processors = [
    postcssPresetEnv({
      features: {
        'nesting-rules': true,
      },
      browsers: postcssBrowsers,
    }),
  ];
  if (process.env.NODE_ENV === 'production') {
    processors.push(cssnano());
  }

  return gulp
    .src([
      path.join(bowerComponents, 'normalize-css/normalize.css'),
      path.join(highlightStylesheetsDir, 'github.css'),
      ...codemirrorStylesheets,
      path.join(stylesheetsDir, '**/*.css'),
    ])
    .pipe(concat('application.css'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(distDir))
    .pipe(browserSync.stream());
});

gulp.task(
  'js',
  () =>
    new Promise((resolve, reject) => {
      webpack(webpackConfiguration(process.env.NODE_ENV), (error, stats) => {
        if (error) {
          reject(error);
          return;
        }

        if (stats.hasErrors()) {
          reject(new Error(stats.toJson().errors.join('\n\n')));
          return;
        }

        if (stats.hasWarnings()) {
          // eslint-disable-next-line no-console
          console.warn(stats.toJson().warnings);
        }

        resolve(stats);
      });
    }),
);

gulp.task('build', gulp.parallel('static', 'css', 'js'));

gulp.task('syncFirebase', async () => {
  const data = await pify(fs).readFile(
    path.resolve(__dirname, 'config/firebase-auth.json'),
  );
  const firebaseSecret = process.env.FIREBASE_SECRET;
  if (!firebaseSecret) {
    throw new Error('Missing environment variable FIREBASE_SECRET');
  }

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: `${config.firebaseApp}.firebaseio.com`,
        path: `/.settings/rules.json?auth=${firebaseSecret}`,
        method: 'PUT',
      },
      res => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          res.on('data', reject);
        }
      },
    );

    req.write(data);
    req.end();
  });
});

gulp.task(
  'browserSync',
  gulp.series('static', () => {
    const compiler = webpack(webpackConfiguration(process.env.NODE_ENV));
    compiler.plugin('invalid', browserSync.reload);
    browserSync.init({
      ghostMode: false,
      notify: false,
      open: !isDocker(),
      reloadOnRestart: true,
      server: {
        baseDir: distDir,
        middleware: [
          webpackDevMiddleware(compiler, {
            lazy: false,
          }),
        ],
      },
    });
  }),
);

gulp.task(
  'dev',
  gulp.series(gulp.parallel('browserSync', 'static', 'css'), () => {
    gulp.watch(path.join(staticDir, '/**/*'), ['static']);
    gulp.watch(path.join(stylesheetsDir, '**/*.css'), ['css']);
    gulp.watch(path.join(distDir, '*')).on('change', browserSync.reload);
  }),
);

gulp.task('purgeCache', () =>
  cloudflare({
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY,
  }).zones.purgeCache(process.env.CLOUDFLARE_ZONE, {
    files: [
      `https://${process.env.HOSTNAME}/index.html`,
      `https://${process.env.HOSTNAME}/application.css`,
    ],
  }),
);
