import partial from 'lodash/partial';
import getPostcssResult from 'stylelint/dist/getPostcssResult';
import lintSource from 'stylelint/dist/lintSource';

const stylelint = {};

const config = {
  rules: {
    'declaration-block-trailing-semicolon': ['always'],
  },
  pluginFunctions: {},
};

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
  console.log(code);
  return lintSource(stylelint, {code});
};
