import checkAgainstRule from 'stylelint/lib/utils/checkAgainstRule';
import parse from 'postcss/lib/parse';
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

  async _getRawErrors() {
    try {
      const warnings = [];
      checkAgainstRule(
        {
          ruleName: 'declaration-block-trailing-semicolon',
          ruleSettings: ['always'],
          root: parse(this._source),
        },
        warning => warnings.push(warning),
      );
      return warnings;
    } catch (syntaxError) {
      return [syntaxError];
    }
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
