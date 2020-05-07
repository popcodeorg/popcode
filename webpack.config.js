const fs = require('fs');
const path = require('path');

const babel = require('@babel/core');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const escapeRegExp = require('lodash.escaperegexp');
const OfflinePlugin = require('offline-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const VisualizerPlugin = require('webpack-visualizer-plugin');

function getCacheKeyForBabelConfigItem(configItem) {
  const cacheKey = {
    options: configItem.options,
    name: configItem.name,
  };
  const pathSegments = configItem.file.resolved.split(path.sep);
  while (!('version' in cacheKey)) {
    pathSegments.pop();
    const packagePath = [...pathSegments, 'package.json'].join('/');
    if (fs.existsSync(packagePath)) {
      const package = require(packagePath);
      cacheKey.name = package.name;
      cacheKey.version = package.version;
    }
  }
  return cacheKey;
}

function makeBabelLoaderConfig({shouldCache = false} = {}) {
  if (!shouldCache) {
    return {};
  }

  const babelrc = babel.loadPartialConfig().options;
  const babelLoaderVersion = require('./node_modules/babel-loader/package.json')
    .version;

  const babelrcCacheKey = {
    ...babelrc,
    plugins: babelrc.plugins.map(getCacheKeyForBabelConfigItem),
    presets: babelrc.presets.map(getCacheKeyForBabelConfigItem),
  };

  return {
    cacheCompression: false,
    cacheDirectory: './.cache/babel-loader',
    cacheIdentifier: JSON.stringify({
      babel: babel.version,
      'babel-loader': babelLoaderVersion,
      options: babelrcCacheKey,
    }),
  };
}
function matchModule(modulePath) {
  const modulePattern = new RegExp(
    escapeRegExp(path.join(path.sep, 'node_modules', modulePath)),
    'u',
  );
  const moduleDependencyPattern = new RegExp(
    escapeRegExp(
      path.join(path.sep, 'node_modules', modulePath, 'node_modules'),
    ),
    'u',
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
      FIREBASE_APP_ID: '1:488497217137:web:8a7ee07a38d0590a',
      FIREBASE_API_KEY: 'AIzaSyCHlo2RhOkRFFh48g779YSZrLwKjoyCcws',
      FIREBASE_CLIENT_ID:
        '488497217137-c0mdq8uca6ot5o9u9avo3j5mfsi1q9v5.apps.googleusercontent.com',
      FIREBASE_MEASUREMENT_ID: 'G-GSST3YLQE7',
      FIREBASE_PROJECT_ID: 'popcode-development',
      GIT_REVISION: null,
      MIXPANEL_TOKEN: '68e1844d4a34c789e9368740a3bb4ceb',
      NODE_ENV: env,
      WARN_ON_DROPPED_ERRORS: 'false',
    }),

    new CircularDependencyPlugin({
      exclude: /node_modules/u,
      failOnError: true,
    }),
    new webpack.NormalModuleReplacementPlugin(
      new RegExp(
        `${escapeRegExp(
          path.join('node_modules', 'stylelint', 'lib', 'requireRule.js'),
        )}$`,
        'u',
      ),
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

  if (!isProduction) {
    plugins.push(
      new HardSourceWebpackPlugin({
        cacheDirectory: path.resolve(
          __dirname,
          '.cache/hard-source/[confighash]',
        ),
        info: {level: 'warn'},
      }),
    );
  }

  let devtool;
  if (isProduction) {
    devtool = 'source-map';
  } else if (isTest) {
    devtool = 'inline-source-map';
  } else {
    devtool = 'cheap-module-eval-source-map';
  }

  if (!isTest) {
    plugins.push(
      new OfflinePlugin({
        caches: {
          main: [/(?:^|~)(?:main|preview)[-.~]/u, ':externals:'],
          additional: [':rest:'],
        },
        safeToUseOptionalCaches: isProduction,
        AppCache: {
          caches: ['main', 'additional', 'optional'],
        },
        publicPath: '/',
        responseStrategy: 'network-first',
        externals: ['/', 'application.css', 'images/pop/thinking.svg'],
      }),
      new HtmlWebpackPlugin({
        template: './html/index.html',
        chunksSortMode: 'auto',
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
        inline: /(^|~)inline[.~-]/u,
        prefetch: {
          chunks: 'async',
          test: /\.js$/u,
        },
        custom: [
          {
            test: /^(?!(|.*~)main[.~-])/u,
            attribute: 'type',
            value: 'ref',
          },
          {
            test: /^$/u,
            attribute: 'type',
            value: 'text/javascript',
          },
          {
            test: /(^|~)preview[.~-]/u,
            attribute: 'class',
            value: 'preview-bundle',
          },
        ],
      }),
    );
  }

  const babelLoaderConfig = makeBabelLoaderConfig({shouldCache: !isProduction});

  return {
    mode: isProduction ? 'production' : 'development',
    entry: isTest
      ? undefined
      : {
          inline: 'first-input-delay',
          main: './application.js',
          preview: './preview.js',
        },
    context: path.resolve(__dirname, 'src'),
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
          test: /\.gen\.js$/u,
          include: path.resolve(__dirname, 'src'),
          use: ['val-loader'],
          enforce: 'pre',
        },
        {
          test: /\.gen\.js$/u,
          use: [{loader: 'babel-loader', options: babelLoaderConfig}],
        },
        {
          test: /\.jsx?$/u,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'test'),
          ],
          use: [
            {loader: 'babel-loader', options: babelLoaderConfig},
            {
              loader: 'eslint-loader',
              options: {
                emitWarning: true,
                failOnError: true,
              },
            },
          ],
          enforce: 'pre',
        },
        {
          test: /\.js$/u,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          include: [
            path.resolve(__dirname, 'bower_components'),
            path.resolve(__dirname, 'templates'),
            path.resolve(__dirname, 'node_modules/jquery/dist'),
            path.resolve(__dirname, 'node_modules/p5/lib'),
          ],
          use: ['raw-loader'],
        },
        {
          test: /\.svg$/u,
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
          test: /\.js$/u,
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
          test: /\.js$/u,
          include: [path.resolve(__dirname, 'node_modules')],
          exclude: [matchModule('brace')],
          use: {loader: 'babel-loader', options: babelLoaderConfig},
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
          test: /\.js$/u,
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
          test: /\.js$/u,
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
