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

  const pluginImports = keys.map((key, index) =>
    `import plugin${index} from\n'@babel/plugin-${key}';`).join('\n');

  const pluginNames = keys.map((key, index) => `plugin${index}`).
    join(',\n');

  return {
    code: `
import { transformAsync } from '@babel/core';
${pluginImports}

/**
 * Transforms source code using settings from brower.json
 *
 * Returns a promise containing the source.
 *
 * @parameter {string} source
 * @returns Promise<string>
 */
function babelWithEnv(source, inputSourceMap) {
  return transformAsync(source, {
    sourceType: 'script',
    plugins: [
${pluginNames}
],
    sourceMaps: 'both',
    sourceFileName: 'popcodePreview.js',
    inputSourceMap,
  }).then(function (result) {
    return {
      code: result.code,
      sourceMap: result.map
    };
  }, function (error) {
    throw new Error(error);
  });
}

export { babelWithEnv };
    `,
  };
};
