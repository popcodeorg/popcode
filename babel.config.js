const fs = require('fs');
const path = require('path');

module.exports = (api) => {
  let targets;

  const callerName = api.caller(({name}) => name);
  api.cache.using(() => `${callerName}:${process.env.NODE_ENV}`);

  if (callerName === 'babel-jest') {
    targets = {node: 'current'};
  } else if (process.env.DEBUG === 'true') {
    targets = {browsers: 'last 1 Chrome version'};
  } else {
    targets = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'config/browsers.json')),
    );
  }


  return {
    presets: [
      '@babel/preset-react',
      ['@babel/preset-env', {targets, modules: 'auto'}],
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import'],
    env: {
      test: {
        plugins: ['dynamic-import-node'],
      },
    },
    compact: false,
    overrides: [
      {
        include: './node_modules/parse5-sax-parser/lib/index.js',
      },
    ],
  };
};
