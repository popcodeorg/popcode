import css from 'css';

import Validator from '../Validator';

const errorMap = {
  'missing \'{\'': () => ({reason: 'missing-opening-curly'}),

  'property missing \':\'': () => ({
    reason: 'property-missing-colon',
    suppresses: ['invalid-token', 'missing-closing-curly'],
  }),

  'selector missing': () => ({
    reason: 'selector-missing',
    suppresses: ['invalid-token'],
  }),
};

class CssValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  async getRawErrors() {
    return css.parse(this.source, {silent: true}).stylesheet.parsingErrors;
  }

  keyForError(error) {
    return error.reason;
  }

  locationForError(error) {
    const row = error.line - 1;
    const column = error.column - 1;
    return {row, column};
  }
}

export default source => new CssValidator(source).getAnnotations();
