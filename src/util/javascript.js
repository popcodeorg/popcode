import {parse} from 'esprima';
import find from 'lodash/find';

function tryParse(javascript) {
  try {
    return parse(javascript);
  } catch (e) {
    return null;
  }
}

export function hasExpressionStatement(javascript) {
  const maybeParsed = tryParse(javascript);
  return Boolean(maybeParsed && find(maybeParsed.body,
    ({type}) => type === 'ExpressionStatement'));
}
