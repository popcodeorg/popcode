import Validator from '../Validator';

const errorMap = {
  // CSS Syntax Errors
  'Unclosed block': (error) => {
    const token = error.source;

    return {
      reason: 'missing-closing-curly',
      payload: {error: token},
      suppresses: ['missing-opening-curly'],
    };
  },

  // Custom rules
  'declaration-block-trailing-semicolon': (error) => {
    const token = error.css;
    const rowError = error.messages[0].line - 1;

    return {
      reason: 'missing-semicolon',
      row: rowError,
      payload: {error: token},
    };
  },
};

class StyleLintValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  // Wrap in an object to avoid iterating over properties in _baseForOwn.js
  _getRawErrors() {
    return System.import('../linters').then(
      ({stylelint}) => stylelint(
        this._source
      ).then(
        (result) => ({result})
      ).catch(
        (syntaxError) => ({syntaxError})
      )
    );
  }

  _keyForError(error) {
    // On Syntax Errors
    if (error.reason) {
      return error.reason;
    }

    // On Custom Rules
    if (error.messages.length > 0) {
      return error.messages[0].rule;
    }

    return '';
  }

  _locationForError(error) {
    if (!error.token) {
      return {row: 0, column: 0};
    }
    return {row: error.token.line - 1, column: error.token.charNum - 1};
  }
}

export default (source) => new StyleLintValidator(source).getAnnotations();
