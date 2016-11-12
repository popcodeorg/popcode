import Validator from '../Validator';

const errorMap = {
  // CSS Syntax Errors
  'Unclosed block': (error) => {
    const token = error.source;

    return {
      reason: 'missing-closing-curly',
      payload: {error: token},
    };
  },

  // Custom Rules
  'declaration-block-trailing-semicolon': (error) => {
    const token = error.css;

    return {
      reason: 'missing-semicolon',
      payload: {error: token},
    };
  },
};

class StyleLintValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

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
    // CSS Syntax Error or Custom Rule
    return error.reason || (error.messages[0] && error.messages[0].rule);
  }

  _locationForError(error) {
    // CSS Syntax Error
    if (error.reason) {
      return {row: error.line - 1, column: error.column};
    }

    // Custom Rule
    const customRule = error.messages[0];
    if (customRule) {
      return {
        row: customRule.line - 1, column: customRule.column,
      };
    }

    return {row: 0, column: 0};
  }
}

export default (source) => new StyleLintValidator(source).getAnnotations();
