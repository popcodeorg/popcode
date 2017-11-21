import Validator from '../Validator';
import retryingFailedImports from '../retryingFailedImports';

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

  async _getRawErrors() {
    const {'default': stylelint} = await retryingFailedImports(() => import(
      /* webpackChunkName: 'linters' */
      '../../util/minimalStylelint',
    ));
    let result;
    try {
      result = await stylelint(this._source);
    } catch (syntaxError) {
      return [syntaxError];
    }
    return result.messages;
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

export default source => new StyleLintValidator(source).getAnnotations();
