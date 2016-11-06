import Validator from '../Validator';

const errorMap = {};

class StyleLintValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  _getRawErrors() {
    return System.import('../linters').then(({stylelint}) => {
      try {
        stylelint.lint({
          code: this._source,
        }).then((result) => result.output);
        return [];
      } catch (_e) {
        return [];
      }
    });
  }

  _keyForError(error) {
    return error.code.split(':')[0];
  }

  _locationForError(error) {
    if (!error.token) {
      return {row: 0, column: 0};
    }
    return {row: error.token.line - 1, column: error.token.charNum - 1};
  }
}

export default (source) => new StyleLintValidator(source).getAnnotations();
