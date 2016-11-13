import Validator from '../Validator';

const errorMap = {
  'syntaxError/Unclosed block': () => ({
    reason: 'missing-closing-curly',
  }),

  'lintRule/declaration-block-trailing-semicolon': () => ({
    reason: 'missing-semicolon',
  }),
};

function isSyntaxError(error) {
  return error.name === 'CssSyntaxError';
}

class StyleLintValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  _getRawErrors() {
    return System.import('../linters').then(
      ({stylelint}) => stylelint(
        this._source
      ).then(
        (result) => (result.messages),
        (syntaxError) => ([syntaxError])
      )
    );
  }

  _keyForError(error) {
    if (isSyntaxError(error)) {
      return `syntaxError/${error.reason}`;
    }

    return `lintRule/${error.rule}`;
  }

  _locationForError(error) {
    return {row: error.line - 1, column: error.column};
  }
}

export default (source) => new StyleLintValidator(source).getAnnotations();
