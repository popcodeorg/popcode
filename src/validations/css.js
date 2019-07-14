import mergeValidations from './mergeValidations';
import validateWithCss from './css/css';
import validateWithPrettyCSS from './css/prettycss';
import validateWithStyleLint from './css/stylelint';

export default source =>
  mergeValidations([
    validateWithCss(source),
    validateWithPrettyCSS(source),
    validateWithStyleLint(source),
  ]);
