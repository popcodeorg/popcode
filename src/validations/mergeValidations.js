import groupBy from 'lodash-es/groupBy';
import values from 'lodash-es/values';
import flatten from 'lodash-es/flatten';
import flatMap from 'lodash-es/flatMap';
import sortBy from 'lodash-es/sortBy';
import omit from 'lodash-es/omit';
import uniqWith from 'lodash-es/uniqWith';

function filterErrors(errors) {
  function dedupeErrors(errs) {
    return uniqWith(errs, (e, i) => e.reason === i.reason && i.row === e.row);
  }
  const dedupedErrors = dedupeErrors(errors);
  const groupedErrors = groupBy(dedupedErrors, 'reason');

  const suppressedTypes = flatMap(flatten(values(groupedErrors)), 'suppresses');

  return flatten(values(omit(groupedErrors, suppressedTypes)));
}

async function mergeValidations(errors) {
  const results = await Promise.all(errors);
  const filteredErrors = filterErrors(flatten(results));
  return sortBy(filteredErrors, 'row');
}

export default mergeValidations;
