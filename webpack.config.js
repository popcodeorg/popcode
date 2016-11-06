const path = require('path');
const webpack = require('webpack');
const escapeRegExp = require('lodash/escapeRegExp');

function matchModule(modulePath) {
  return new RegExp(`\\/node_modules\\/${escapeRegExp(modulePath)}`);
}

module.exports = {
  entry: './src/application.js',
  output: {
    path: path.resolve(__dirname, './static/compiled'),
    publicPath: '/compiled/',
    filename: 'application.js',
    sourceMapFilename: 'application.js.map',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'spec'),
        ],
        loaders: ['babel-loader', 'transform/cacheable?brfs-babel'],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/htmllint'),
        ],
        loader: 'transform/cacheable?bulkify',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/PrettyCSS'),
          path.resolve(__dirname, 'node_modules/css'),
        ],
        loader: 'transform/cacheable?brfs',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/postcss/lib/previous-map'),
          path.resolve(__dirname, 'node_modules/stylelint/dist/getPostcssResult'),
          path.resolve(__dirname, 'node_modules/stylelint/node_modules/sugarss/node_modules/postcss/lib/previous-map'),
          path.resolve(__dirname, 'node_modules/stylelint/node_modules/postcss-scss/node_modules/postcss/lib/previous-map'),
        ],
        loader: 'string-replace',
        query: {
          search: /require\(['"]fs['"]\)/,
          replace: '{}',
        },
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(
            __dirname,
            'node_modules/stylelint/dist/utils/isAutoprefixable'
          ),
        ],
        loader: 'substitute',
        query: {content: '() => false'},
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/redux'),
          path.resolve(__dirname, 'node_modules/lodash-es'),
          path.resolve(__dirname, 'node_modules/github-api'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/loop-protect'),
        ],
        loader: 'imports?define=>false',
      },
      {
        include: [
          path.resolve(
            __dirname,
            'node_modules/html-inspector/html-inspector.js'
          ),
        ],
        loader: 'imports?window=>{}!exports?window.HTMLInspector',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/brace/worker'),
          path.resolve(
            __dirname,
            'node_modules/stylelint/dist/rules/no-unsupported-browser-features'
          ),
          path.resolve(
            __dirname,
            'node_modules/stylelint/dist/rules/no-browser-hacks'
          ),
          matchModule('autoprefixer'),
          matchModule('postcss-scss'),
          matchModule('postcss-less'),
          matchModule('sugarss'),
        ],
        loader: 'null',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'FIREBASE_APP',
      'GIT_REVISION',
      'LOG_REDUX_ACTIONS',
      'NODE_ENV',
      'WARN_ON_DROPPED_ERRORS',
    ]),
  ],
  resolve: {
    alias: {
      'github-api$': 'github-api/lib/GitHub.js',
      'github-api': 'github-api/lib',
      'html-inspector$': 'html-inspector/html-inspector.js',
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  devtool: 'source-map',
};
