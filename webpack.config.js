const path = require('path');
const webpack = require('webpack');

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
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/htmllint'),
        ],
        loader: 'transform?bulkify',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/PrettyCSS'),
          path.resolve(__dirname, 'node_modules/css'),
        ],
        loader: 'transform?brfs',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/redux'),
          path.resolve(__dirname, 'node_modules/lodash-es'),
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
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        loaders: ['babel-loader', 'transform?brfs-babel'],
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
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
};
