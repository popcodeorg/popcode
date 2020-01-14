import validateWithEsprima from './javascript/esprima';
import validateWithJSHint from './javascript/jshint';
import mergeValidations from './mergeValidations';

export default (source, analyzer) =>
  mergeValidations([
    validateWithEsprima(source),
    validateWithJSHint(source, analyzer),
  ]);
