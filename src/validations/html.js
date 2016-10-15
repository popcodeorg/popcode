import mergeValidations from './mergeValidations';
import trim from 'lodash/trim';
import validateWithHtmlInspector from './html/htmlInspector.js';
import validateWithHtmllint from './html/htmllint.js';
import validateWithSlowparse from './html/slowparse.js';

export default (source) => mergeValidations([
  validateWithHtmlInspector(source),
  validateWithHtmllint(source),
  validateWithSlowparse(trim(source)),
]);
