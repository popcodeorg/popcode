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

  const plugins = ['syntax-dynamic-import'];
  if (isJest) {
    plugins.push('dynamic-import-node');
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
        },
      ],
    ],
    plugins,
    compact: false,
  };
};
