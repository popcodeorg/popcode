import Validator from '../Validator';
import retryingFailedImports from '../../util/retryingFailedImports';

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

  async _getRawErrors() {
    const css = await retryingFailedImports(() => import(
      /* webpackChunkName: 'mainAsync' */
      'css',
    ));
    return css.parse(this._source, {silent: true}).stylesheet.parsingErrors;
  }

  _keyForError(error) {
    return error.reason;
  }

  _locationForError(error) {
    const row = error.line - 1;
    const column = error.column - 1;
    return {row, column};
  }
}

export default source => new CssValidator(source).getAnnotations();
