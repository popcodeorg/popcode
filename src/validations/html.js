import mergeValidations from './mergeValidations';
import trim from 'lodash/trim';
import validateWithHtmllint from './html/htmllint.js';
import validateWithSlowparse from './html/slowparse.js';

export default (source) => mergeValidations([
  validateWithSlowparse(trim(source)),
  validateWithHtmllint(source),
]);
