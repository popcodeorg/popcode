import flatten from 'lodash/flatten';
import validateWithEsprima from './javascript/esprima';
import validateWithJSHint from './javascript/jshint';

export default (source, enabledLibraries) => Promise.all([
  validateWithEsprima(source, enabledLibraries),
  validateWithJSHint(source, enabledLibraries),
]).then((results) => flatten(results));
