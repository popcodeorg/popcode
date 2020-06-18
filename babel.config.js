const fs = require('fs');
const path = require('path');

module.exports = api => {
  let targets;

  const isJest = api.caller(caller => caller && caller.name === 'babel-jest');
  api.cache.using(() => `${isJest}:${process.env.NODE_ENV}`);

  if (isJest) {
    targets = {node: 'current'};
  } else if (process.env.DEBUG === 'true') {
    targets = {browsers: 'last 1 Chrome version'};
  } else {
    targets = JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, 'config/browsers.json'))
        .toString(),
    );
  }

  const plugins = ['@babel/syntax-dynamic-import'];
  if (isJest) {
    plugins.push('babel-plugin-dynamic-import-node');
  }

  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets,
          modules: isJest ? 'auto' : false,
          useBuiltIns: 'entry',
          corejs: 3,
          exclude: ['transform-typeof-symbol'],
        },
      ],
    ],
    plugins,
    compact: false,
    overrides: isJest
      ? [
          {
            test: './node_modules/html-inspector/html-inspector.js',
            plugins: [
              [
                'transform-globals',
                {import: {'html-inspector/window': {window: 'default'}}},
              ],
            ],
          },
        ]
      : [],
  };
};
