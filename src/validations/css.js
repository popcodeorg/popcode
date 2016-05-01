import mergeValidations from './mergeValidations';
import validateWithCss from './css/css.js';
import validateWithPrettyCSS from './css/prettycss.js';

export default (source) => mergeValidations([
  validateWithCss(source),
  validateWithPrettyCSS(source),
]);
