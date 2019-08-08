const path = require('path');

const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');

const browserList = require('../../config/browsers.json');

const EXCLUDED_MODULES = ['transform-regenerator'];

function getPluginNamesFromPresetEnv() {
  const browserListForBabel = {};

  for (const browser in browserList) {
    if (browser !== 'chromium') {
      browserListForBabel[browser] = browserList[browser];
    }
  }

  const result = babel.transformSync('', {
    sourceType: 'script',
    presets: [
      [
        presetEnv,
        {
          targets: browserListForBabel,
          exclude: EXCLUDED_MODULES,
        },
      ],
    ],
  });

  return result.options.plugins
    .map(plugin => plugin.key)
    .filter(key => path.parse(key).root === '');
}

module.exports = () => {
  const keys = getPluginNamesFromPresetEnv();

  const pluginImports = keys
    .map((key, index) => `import plugin${index} from\n'@babel/plugin-${key}';`)
    .join('\n');

  const pluginNames = keys.map((key, index) => `plugin${index}`).join(',\n');

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
export async function babelWithEnv(source, inputSourceMap) {
  try {
    const result = await transformAsync(source, {
      sourceType: 'script',
      plugins: [${pluginNames}],
      sourceMaps: 'both',
      sourceFileName: 'popcodePreview.js',
      inputSourceMap,
    });

    return {
      code: result.code,
      sourceMap: result.map
    };
  } catch (e) {
    throw new Error(e);
  }
}
    `,
  };
};
