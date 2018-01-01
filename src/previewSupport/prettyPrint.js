import inspect from 'object-inspect';
import isUndefined from 'lodash/isUndefined';

export default function prettyPrint(value) {
  if (isUndefined(value)) {
    return value;
  }
  return inspect(value, {quoteStyle: 'double'});
}
