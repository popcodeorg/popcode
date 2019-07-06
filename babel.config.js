const fs = require('fs');
const path = require('path');

module.exports = api => {
  let targets;

  const isJest = api.caller(({name}) => name === 'babel-jest');
  api.cache.using(() => `${isJest}:${process.env.NODE_ENV}`);

  if (isJest) {
    targets = {node: 'current'};
  } else if (process.env.DEBUG === 'true') {
    targets = {browsers: 'last 1 Chrome version'};
  } else {
    targets = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'config/browsers.json')),
    );
  }

  const plugins = ['@babel/plugin-syntax-dynamic-import'];
  if (isJest) {
    plugins.push('babel-plugin-dynamic-import-node');
  }

  return {
    presets: [
      '@babel/preset-react',
      ['@babel/preset-env', {targets, modules: isJest ? 'auto' : false}],
    ],
    plugins,
    compact: false,
  };
};
