/* eslint-env node */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-commonjs */
/* eslint-disable comma-dangle */

const fs = require('fs');
const path = require('path');
const escapeRegExp = require('lodash/escapeRegExp');
const startsWith = require('lodash/startsWith');
const map = require('lodash/map');
const includes = require('lodash/includes');
const babel = require('babel-core');
const babelLoaderVersion =
  require('./node_modules/babel-loader/package.json').version;

process.traceDeprecation = true;

let targets;
if (process.env.DEBUG === 'true') {
  targets = {browsers: 'last 1 Chrome version'};
} else {
  targets = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'config/browsers.json'))
  );
}
const babelrc = {
  presets: [
    'react',
    ['env', {targets, modules: false}]
  ],
  compact: false,
  cacheDirectory: true,
  cacheIdentifier: JSON.stringify({
    babel: babel.version,
    'babel-loader': babelLoaderVersion,
    debug: process.env.DEBUG,
    env: process.env.NODE_ENV || 'development',
  }),
};

function matchModule(modulePath) {
  const modulePattern = new RegExp(
    escapeRegExp(path.join('/node_modules', modulePath))
  );
  const moduleDependencyPattern = new RegExp(
    escapeRegExp(path.join('/node_modules', modulePath, 'node_modules'))
  );

  return filePath =>
    modulePattern.test(filePath) && !moduleDependencyPattern.test(filePath);
}

function directoryContentsExcept(directory, exceptions) {
  const fullExceptions = map(
    exceptions,
    exception => path.resolve(directory, exception)
  );

  return filePath =>
    startsWith(filePath, path.resolve(directory)) &&
      !includes(fullExceptions, filePath);
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test'),
        ],
        use: [
          {loader: 'babel-loader', options: babelrc},
          'eslint-loader'
        ],
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
      },
      {
        include: [
          path.resolve(__dirname, 'bower_components'),
          path.resolve(__dirname, 'templates'),
        ],
        use: ['raw-loader'],
      },
      {
        test: /\.svg$/,
        loader: [
          'svg-react-loader',
          {
            loader: 'svgo-loader',
            query: {
              plugins: [
                {
                  removeXMLNS: true,
                },
                {
                  removeAttrs: {
                    active: true,
                    attrs: 'svg:data-name',
                  },
                },
              ],
            },
          },
        ],
      },
      {
        include: path.resolve(__dirname, 'locales'),
        use: [{
          loader: 'i18next-resource-store-loader',
          options: 'include=\\.json$',
        }],
      },
      {
        include: matchModule('htmllint'),
        enforce: 'post',
        use: ['transform-loader/cacheable?bulkify'],
      },
      {
        include: [matchModule('PrettyCSS'), matchModule('css')],
        use: ['transform-loader/cacheable?brfs'],
      },
      {
        test: /\.js$/,
        include: [
          matchModule('htmllint'),
        ],
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: 'require(plugin)',
            replace: 'undefined',
          },
        }],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(
            __dirname,
            'node_modules/stylelint/lib/utils/isAutoprefixable'
          ),
        ],
        use: [{
          loader: 'substitute-loader',
          options: {content: '() => false'},
        }],
      },
      {
        test: /\.js$/,
        include: [
          matchModule('redux'),
          matchModule('lodash-es'),
          matchModule('stylelint'),
          matchModule('redux-saga-debounce-effect'),
        ],
        use: {loader: 'babel-loader', options: babelrc},
      },
      {
        include: matchModule('html-inspector'),
        use: [
          {loader: 'imports-loader', options: 'window=>{}'},
          {
            loader: 'exports-loader',
            options: {HTMLInspector: 'window.HTMLInspector'},
          },
        ],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/brace/worker'),
          matchModule('autoprefixer'),
          matchModule('postcss-scss'),
          matchModule('postcss-less'),
          matchModule('sugarss'),
          matchModule('stylelint/lib/dynamicRequire'),
          matchModule('css/lib/stringify/source-map-support'),
        ],
        use: ['null-loader'],
      },
      {
        test: /\.js$/,
        include: directoryContentsExcept(
          'node_modules/stylelint/lib/rules',
          [
            'index.js',
            'declaration-block-trailing-semicolon/index.js',
          ]
        ),
        use: ['null-loader'],
      }
    ],
  },

  node: {
    fs: 'empty',
  },

  resolve: {
    alias: {
      'github-api$': 'github-api/dist/components/GitHub.js',
      'github-api': 'github-api/dist/components',
      'html-inspector$': 'html-inspector/html-inspector.js',
    },
    extensions: ['.js', '.jsx', '.json'],
  },
};
