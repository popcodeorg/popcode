import last from 'lodash/last';
import isNull from 'lodash/isNull';
import Validator from '../Validator';

const errorMap = {
  'validate-element-location': (error) => ({
    reason: 'invalid-tag-location',
    payload: {
      tag: error.context.tagName.toLowerCase(),
      parent: error.context.parentNode.tagName.toLowerCase(),
    },
  }),
};

class HtmlInspectorValidator extends Validator {
  constructor(source) {
    super(source, 'html', errorMap);
    this._doc = new DOMParser().parseFromString(this._source, 'text/html');
  }

  _getRawErrors() {
    if (isNull(this._doc.documentElement)) {
      return Promise.resolve([]);
    }

    return System.import('../linters').then(({HTMLInspector}) =>
      new Promise((resolve) => {
        HTMLInspector.inspect({
          domRoot: this._doc.documentElement,
          useRules: ['validate-element-location'],
          onComplete: resolve,
        });
      })
    );
  }

  _keyForError(error) {
    return error.rule;
  }

  _locationForError(error) {
    const range = this._doc.createRange();
    range.setEndBefore(error.context);
    const lines = range.toString().split('\n');

    const droppedNewlines =
      this._source.split('\n').length -
      this._doc.documentElement.outerHTML.split('\n').length;

    return {
      row: droppedNewlines + lines.length - 1,
      column: last(lines).length,
    };
  }
}

export default (source) => new HtmlInspectorValidator(source).getAnnotations();
