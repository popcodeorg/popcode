module.exports = {
  entry: './src/application.js',
  output: {
    path: './static/compiled',
    filename: 'application.js',
  },
  module: {
    loaders: [
      {
        test: /node_modules\/htmllint\//,
        loader: 'transform?bulkify',
      },
      {
        test: /\.jsx?$/,
        loader: 'transform?brfs',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
