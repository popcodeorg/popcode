const {
  default: generateData,
  generateFile,
} = require('inline-style-prefixer/lib/generator');

const browserList = require('../../../config/browsers.json');

module.exports = () => {
  const browserListForInlineStylePrefixer = {};

  for (const browser in browserList) {
    if (browser !== 'chromium') {
      browserListForInlineStylePrefixer[browser] = Number(browserList[browser]);
    }
  }

  const {prefixMap, plugins} = generateData(browserListForInlineStylePrefixer);

  return {code: generateFile(prefixMap, plugins, false)};
};
