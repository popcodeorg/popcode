import {t} from 'i18next';
import assign from 'lodash-es/assign';
import map from 'lodash-es/map';
import compact from 'lodash-es/compact';
import remark from 'remark';
import stripMarkdown from 'strip-markdown';

import config from '../config';

class Validator {
  constructor(source, language, errorMap) {
    this.source = source;
    this._language = language;
    this._errorMap = errorMap;
  }

  async getAnnotations() {
    const errors = await this.getRawErrors();
    return compact(map(
      errors,
      this._convertErrorToAnnotation.bind(this),
    ));
  }

  mapError(rawError) {
    const key = this.keyForError(rawError);
    if (this._errorMap.hasOwnProperty(key)) {
      return this._errorMap[key](rawError, this.source);
    }
    return null;
  }

  _convertErrorToAnnotation(rawError) {
    const error = this.mapError(rawError);
    if (!error) {
      if (config.warnOnDroppedErrors) {
        // eslint-disable-next-line no-console
        console.warn(this.constructor.name, 'dropped error', rawError);
      }

      return null;
    }

    const message = t(
      `errors.${this._language}.${error.reason}`,
      error.payload,
    );

    const location = this.locationForError(rawError);

    return assign({}, location, error, {
      text: remark().use(stripMarkdown).processSync(message).toString(),
      raw: message,
      type: 'error',
    });
  }

  keyForError() {
    throw new Error('Subclasses must define keyForError()');
  }

  getRawErrors() {
    throw new Error('Subclasses must define getRawErrors()');
  }

  rowForError() {
    throw new Error('Subclasses must define rowForError()');
  }

  columnForError() {
    throw new Error('Subclasses must define columnForError()');
  }
}

export default Validator;
