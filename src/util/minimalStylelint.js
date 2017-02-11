import partial from 'lodash/partial';
import getPostcssResult from 'stylelint/lib/getPostcssResult';
import lintSource from 'stylelint/lib/lintSource';

const stylelint = {};

const config = {
  rules: {
    'declaration-block-trailing-semicolon': ['always'],
  },
  pluginFunctions: {},
};

function preventPostcssResultCaching() {
  stylelint._postcssResultCache.clear();
}

Object.assign(stylelint, {
  _postcssResultCache: new Map(),
  _options: {},

  getConfigForFile() {
    return Promise.resolve({config});
  },

  isPathIgnored() {
    return Promise.resolve(false);
  },

  _getPostcssResult: partial(getPostcssResult, stylelint),
});

export default (code) => {
  preventPostcssResultCaching();
  return lintSource(stylelint, {code});
};
