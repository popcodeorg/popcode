import i18n from 'i18next';
import assign from 'lodash/assign';
import map from 'lodash/map';
import compact from 'lodash/compact';
import config from '../config';

class Validator {
  constructor(source, language, errorMap, analyzer) {
    this._source = source;
    this._language = language;
    this._errorMap = errorMap;
    this._analyzer = analyzer;
  }

  getAnnotations() {
    return Promise.resolve(this._getRawErrors()).then(
      (errors) => compact(map(
        errors,
        this._convertErrorToAnnotation.bind(this)
      ))
    );
  }

  _mapError(rawError) {
    const key = this._keyForError(rawError);
    if (this._errorMap.hasOwnProperty(key)) {
      return this._errorMap[key](rawError, this._source);
    }
    return null;
  }

  _convertErrorToAnnotation(rawError) {
    const error = this._mapError(rawError);
    if (!error) {
      if (config.warnOnDroppedErrors) {
        // eslint-disable-next-line no-console
        console.warn(this.constructor.name, 'dropped error', rawError);
      }

      return null;
    }

    const message = i18n.t(
      `errors.${this._language}.${error.reason}`,
      error.payload
    );

    const location = this._locationForError(rawError);

    return assign({}, location, error, {
      text: message,
      raw: message,
      type: 'error',
    });
  }

  _keyForError() {
    throw new Error('Subclasses must define _keyForError()');
  }

  _getRawErrors() {
    throw new Error('Subclasses must define _getRawErrors()');
  }

  _rowForError() {
    throw new Error('Subclasses must define _rowForError()');
  }

  _columnForError() {
    throw new Error('Subclasses must define _columnForError()');
  }
}

export default Validator;
