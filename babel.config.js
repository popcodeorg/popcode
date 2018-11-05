/* eslint-env node */
/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

let targets;
if (process.env.DEBUG === 'true') {
  targets = {browsers: 'last 1 Chrome version'};
} else {
  targets = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'config/browsers.json')),
  );
}

module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', {targets, modules: false}],
  ],
  plugins: ['syntax-dynamic-import'],
  compact: false,
}
