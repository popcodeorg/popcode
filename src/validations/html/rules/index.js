import Validator from '../../Validator';
import runRules from '../runRules';

import Code from './Code';
import MismatchedTag from './MismatchedTag';

const errorMap = {
  [Code.MISPLACED_CLOSE_TAG]: ({openTag, closeTag}) => ({
    reason: 'misplaced-close-tag',
    payload: {
      open: openTag.name,
      close: closeTag.name,
      mismatch: closeTag.location.row + 1,
    },
  }),
  [Code.UNCLOSED_TAG]: ({openTag: {name}}) => ({
    reason: 'unclosed-tag',
    payload: {tag: name},
  }),
  [Code.UNOPENED_TAG]: ({closeTag: {name}}) => ({
    reason: 'unexpected-close-tag',
    payload: {tag: name},
  }),
};

class RuleValidator extends Validator {
  constructor(source) {
    super(source, 'html', errorMap);
  }

  keyForError({code}) {
    return code;
  }

  async getRawErrors() {
    return Array.from(await runRules([new MismatchedTag()], this.source));
  }

  locationForError(error) {
    switch (error.code) {
      case Code.MISPLACED_CLOSE_TAG:
        return error.match;
      case Code.UNOPENED_TAG:
      case Code.UNCLOSED_TAG:
        return error.closeTag.location;
      default:
        throw new Error(`Unexpected code in ${JSON.stringify(error)}`);
    }
  }
}

export default source => new RuleValidator(source).getAnnotations();
