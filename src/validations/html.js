import {Promise} from 'es6-promise';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';
import omit from 'lodash/omit';
import trim from 'lodash/trim';
import validateWithHtmllint from './html/htmllint.js';
import validateWithSlowparse from './html/slowparse.js';

function filterErrors(errors) {
  const groupedErrors = groupBy(errors, 'reason');

  const suppressedTypes = flatMap(
    flatten(values(groupedErrors)),
    'suppresses'
  );

  return flatten(values(omit(groupedErrors, suppressedTypes)));
}

export default (source) => Promise.all([
  validateWithSlowparse(trim(source)),
  validateWithHtmllint(source),
]).then((results) => {
  const filteredErrors = filterErrors(flatten(results));
  return sortBy(filteredErrors, 'row');
});
