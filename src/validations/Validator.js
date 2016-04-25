import i18n from 'i18next-client';
import assign from 'lodash/assign';
import map from 'lodash/map';
import compact from 'lodash/compact';

class Validator {
  constructor(source, language, errorMap) {
    this._source = source;
    this._language = language;
    this._errorMap = errorMap;
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
      return this._errorMap[key](rawError);
    }
    return null;
  }

  _convertErrorToAnnotation(rawError) {
    const error = this._mapError(rawError);
    if (!error) {
      return null;
    }

    const message = i18n.t(
      `errors.${this._language}.${error.reason}`,
      error.payload
    );

    return assign(error, {
      text: message,
      raw: message,
      type: 'error',
      row: this._rowForError(rawError),
      column: this._columnForError(rawError),
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
