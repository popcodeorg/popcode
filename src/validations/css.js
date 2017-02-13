import mergeValidations from './mergeValidations';
import validateWithCss from './css/css.js';
import validateWithPrettyCSS from './css/prettycss.js';
import validateWithStyleLint from './css/stylelint.js';

export default source => mergeValidations([
  validateWithCss(source),
  validateWithPrettyCSS(source),
  validateWithStyleLint(source),
]);
