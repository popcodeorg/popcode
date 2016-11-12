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
        (result) => ({result}),
        (syntaxError) => ({syntaxError})
      )
    );
  }

  _keyForError(error) {
    if (isSyntaxError(error)) {
      return `syntaxError/${error.reason}`;
    }

    return error.messages[0] && `lintRule/${error.messages[0].rule}`;
  }

  _locationForError(error) {
    if (isSyntaxError(error)) {
      return {row: error.line - 1, column: error.column};
    }

    const lintRule = error.messages[0];
    if (lintRule) {
      return {
        row: lintRule.line - 1, column: lintRule.column,
      };
    }

    return {row: 0, column: 0};
  }
}

export default (source) => new StyleLintValidator(source).getAnnotations();
