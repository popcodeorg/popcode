/* eslint-env commonjs */
/* eslint-disable import/no-commonjs */

const declarationBlockTrailingSemicolon =
  require('stylelint/lib/rules/declaration-block-trailing-semicolon');

module.exports = function requireRule(ruleName) {
  if (ruleName === 'declaration-block-trailing-semicolon') {
    return declarationBlockTrailingSemicolon;
  }

  throw new Error(`No rule with name ${ruleName}`);
};
