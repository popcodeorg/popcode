import trim from 'lodash/trim';
import mergeValidations from './mergeValidations';
import validateWithHtmlInspector from './html/htmlInspector';
import validateWithHtmllint from './html/htmllint';
import validateWithSlowparse from './html/slowparse';

export default source => mergeValidations([
  validateWithHtmlInspector(source),
  validateWithHtmllint(source),
  validateWithSlowparse(trim(source)),
]);
