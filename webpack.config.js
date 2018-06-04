/* eslint-env node */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

const OfflinePlugin = require('offline-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const escapeRegExp = require('lodash.escaperegexp');
const git = require('git-rev-sync');
const babel = require('babel-core');

const babelLoaderVersion =
  require('./node_modules/babel-loader/package.json').version;

let targets;
if (process.env.DEBUG === 'true') {
  targets = {browsers: 'last 1 Chrome version'};
} else {
  targets = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'config/browsers.json')),
  );
}
const babelrc = {
  presets: [
    'react',
    ['env', {targets, modules: false}],
  ],
  plugins: ['syntax-dynamic-import'],
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
    escapeRegExp(path.join('/node_modules', modulePath)),
  );
  const moduleDependencyPattern = new RegExp(
    escapeRegExp(path.join('/node_modules', modulePath, 'node_modules')),
  );

  return filePath =>
    modulePattern.test(filePath) && !moduleDependencyPattern.test(filePath);
}

module.exports = (env = process.env.NODE_ENV || 'development') => {
  const isProduction = env === 'production';
  const isTest = env === 'test';
  const shouldProfileBuild = Boolean(process.env.PROFILE_BUILD);

  const plugins = [
    new webpack.EnvironmentPlugin({
      FIREBASE_APP: 'popcode-development',
      FIREBASE_API_KEY: 'AIzaSyCHlo2RhOkRFFh48g779YSZrLwKjoyCcws',
      FIREBASE_CLIENT_ID:
      /* eslint-disable-next-line max-len */
        '488497217137-c0mdq8uca6ot5o9u9avo3j5mfsi1q9v5.apps.googleusercontent.com',
      GIT_REVISION: git.short(),
      NODE_ENV: env,
      WARN_ON_DROPPED_ERRORS: 'false',
      GOOGLE_ANALYTICS_TRACKING_ID: 'UA-90316486-2',
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/stylelint\/lib\/requireRule.js$/,
      path.resolve(__dirname, 'src/patches/stylelint/lib/requireRule.js'),
    ),
  ];

  if (shouldProfileBuild) {
    plugins.push(
      new StatsPlugin('profile/stats.json'),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'profile/bundle-analyzer.html',
      }),
      new VisualizerPlugin({
        filename: 'profile/webpack-visualizer.html',
      }),
    );
  }

  let devtool;
  if (isProduction) {
    devtool = 'source-map';
  } else if (isTest) {
    devtool = 'inline-source-map';
  } else {
    devtool = 'eval';
  }

  if (!isTest) {
    plugins.push(
      new OfflinePlugin({
        caches: {
          main: [/(?:^|~)(?:main|preview)[-.~]/, ':externals:'],
          additional: [':rest:'],
        },
        safeToUseOptionalCaches: isProduction,
        AppCache: {
          caches: ['main', 'additional', 'optional'],
        },
        publicPath: '/',
        responseStrategy: 'network-first',
        externals: [
          '/',
          'application.css',
          'fonts/Roboto-Regular-webfont.woff',
          'fonts/Roboto-Regular-webfont.ttf',
          'fonts/Roboto-Regular-webfont.eot',
          'fonts/Roboto-Bold-webfont.woff',
          'fonts/Roboto-Bold-webfont.ttf',
          'fonts/Roboto-Bold-webfont.eot',
          'fonts/inconsolata-regular.woff2',
          'fonts/inconsolata-regular.woff',
          'fonts/inconsolata-regular.ttf',
          'fonts/inconsolata-regular.eot',
          'fonts/fontawesome-webfont.woff2',
          'fonts/fontawesome-webfont.woff',
          'fonts/fontawesome-webfont.ttf',
          'fonts/fontawesome-webfont.eot',
          'images/pop/thinking.svg',
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/html/index.html'),
        chunksSortMode: 'dependency',
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
        prefetch: {
          chunks: 'async',
          test: /\.js$/,
        },
        custom: [
          {
            test: /^(?!(|.*~)main[.~-])/,
            attribute: 'type',
            value: 'ref',
          },
          {
            test: /(^|~)preview[.~-]/,
            attribute: 'class',
            value: 'preview-bundle',
          },
        ],
      }),
    );
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: isTest ? undefined : {
      main: [
        'babel-polyfill',
        'es6-set/implement',
        'whatwg-fetch',
        './src/init/DOMParserShim',
        './src/application.js',
      ],
      preview: [
        'babel-polyfill',
        './src/preview.js',
      ],
    },
    optimization: {
      splitChunks: isTest ? false : {chunks: 'all'},
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    },
    profile: shouldProfileBuild,
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
            'eslint-loader',
          ],
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
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
          use: [
            'svg-react-loader',
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  {
                    removeXMLNS: true,
                  },
                  {
                    removeViewBox: false,
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
          use: [
            {
              loader: 'i18next-resource-store-loader',
              options: 'include=\\.json$',
            },
          ],
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
          include: [matchModule('htmllint')],
          use: [
            {
              loader: 'string-replace-loader',
              options: {
                search: 'require(plugin)',
                replace: 'undefined',
              },
            },
          ],
        },
        {
          test: /\.js$/,
          include: [
            matchModule('ansi-styles'),
            matchModule('ast-types'),
            matchModule('chalk'),
            matchModule('lodash-es'),
            matchModule('postcss-html'),
            matchModule('recast'),
            matchModule('redux'),
            matchModule('stylelint'),
          ],
          use: {loader: 'babel-loader', options: babelrc},
        },
        {
          include: matchModule('html-inspector'),
          use: [
            {loader: 'imports-loader', options: 'window=>{}'},
            {
              loader: 'exports-loader',
              options: {'window.HTMLInspector': true},
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
            matchModule('css/lib/stringify/source-map-support'),
          ],
          use: ['null-loader'],
        },
        {
          test: /\.js$/,
          include: matchModule('moment/locale'),
          use: ['null-loader'],
        },
      ],
    },

    plugins,

    node: {
      fs: 'empty',
    },

    resolve: {
      alias: {
        'github-api$': 'github-api/dist/components/GitHub.js',
        'github-api': 'github-api/dist/components',
        'html-inspector$': 'html-inspector/html-inspector.js',
      },
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    },
    devtool,
  };
};
