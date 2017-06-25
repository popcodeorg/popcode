/* eslint-env node */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable comma-dangle */

const fs = require('fs');
const path = require('path');
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const forOwn = require('lodash/forOwn');
const gutil = require('gulp-util');
const omit = require('lodash/omit');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const webpackConfig = require('../webpack.config');

const bowerComponents = 'bower_components';
const cssnextBrowsers = [];
const supportedBrowsers =
  JSON.parse(fs.readFileSync(path.join(__dirname, 'browsers.json')));
forOwn(supportedBrowsers, (version, browser) => {
  let browserForCssnext = browser;
  if (browser === 'msie') {
    browserForCssnext = 'ie';
  }
  cssnextBrowsers.push(`${browserForCssnext} >= ${version}`);
});

module.exports = {
  html: false,
  images: false,
  fonts: true,
  'static': true,
  svgSprite: false,
  ghPages: false,

  stylesheets: {
    alternateTask: (gulp, PATH_CONFIG) => () => {
      const processors = [cssnext({browsers: cssnextBrowsers})];
      if (gutil.env.production) {
        processors.push(cssnano());
      }

      return gulp.
        src([
          `${bowerComponents}/normalize-css/normalize.css`,
          `${PATH_CONFIG.stylesheets.src}/**/*.css`,
        ]).
        pipe(concat('application.css')).
        pipe(sourcemaps.init({loadMaps: true})).
        pipe(postcss(processors)).
        pipe(sourcemaps.write('./')).
        pipe(gulp.dest(PATH_CONFIG.stylesheets.dest));
    },
  },

  javascripts: {
    entry: {
      app: ['./application.js'],
    },

    plugins() {
      return webpackConfig.plugins;
    },

    customizeWebpackConfig(blendidWebpackConfig) {
      return Object.assign(
        blendidWebpackConfig,
        omit(webpackConfig, ['entry', 'plugins'])
      );
    },
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: 'public',
    },
  },

  production: {
    rev: false,
  },
};
