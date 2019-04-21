const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');

const browserList = require('../../config/browsers.json');

module.exports = () => {
  const browserListForBabel = {};

  for (const browser in browserList) {
    if (browser !== 'chromium') {
      browserListForBabel[browser] = browserList[browser];
    }
  }

  // preset-env doesn't give an introspection API, so we have to get it from
  // the metadata on transformed code
  const result = babel.transformSync('', {
    sourceType: 'script',
    presets: [
      [
        presetEnv,
        {
          targets: browserListForBabel,
          // The module for regenerator causes an import error, so we ignore it
          exclude: ['transform-regenerator'],
        },
      ],
    ],
  });

  const keys = result.options.plugins.map(
    plugin => plugin.key,
  ).filter(
    key => key.indexOf('/') !== 0,
  );

  const plugins = keys.map(key => `require("@babel/plugin-${key}")`).
    join(',\n');

  return {
    code: `
var babel = require('@babel/core');

/**
 * Transforms source code using settings from brower.json
 *
 * Returns a promise containing the source.
 *
 * @parameter {string} source
 * @returns Promise<string>
 */
function babelWithEnv(source) {
  return babel.transformAsync(source, {
    sourceType: 'script',
    plugins: [${plugins}],
  }).then(function (result) {
    return result.code;
  }).catch(function (error) {
    throw new Error(error);
  });
}

module.exports = { babelWithEnv: babelWithEnv };
    `,
  };
};
