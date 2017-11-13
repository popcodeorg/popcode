import last from 'lodash/last';
import isNull from 'lodash/isNull';
import trim from 'lodash/trim';
import {localizedArrayToSentence} from '../../util/arrayToSentence';
import importLinters from '../importLinters';
import Validator from '../Validator';

const specialCases = {
  li: {
    reason: 'invalid-tag-parent',
    parent: ['<ul>', '<ol>', '<menu> tags'],
  },
  title: {
    reason: 'invalid-tag-parent',
    parent: ['<head> tag'],
  },
};

const errorMap = {
  'validate-element-location': (error) => {
    const tag = error.context.tagName.toLowerCase();
    const parent = error.context.parentNode.tagName.toLowerCase();
    if (specialCases[tag]) {
      const specialCase = specialCases[tag];
      return {
        reason: specialCase.reason,
        payload: {
          tag,
          parent: localizedArrayToSentence(specialCase.parent),
        },
      };
    }

    return {
      reason: 'invalid-tag-location',
      payload: {
        tag,
        parent,
      },
    };
  },
  'invalid-list-children': (error) => {
    const tag = error.context.tagName.toLowerCase();

    return {
      reason: 'invalid-list-children',
      payload: {
        tag,
        children: 'li',
      },
    };
  },
};

function invalidListChildrenValidator(listener, reporter) {
  listener.on('element', (elementName, domElement) => {
    if (domElement.childNodes.length &&
        (elementName === 'ul' || elementName === 'ol')) {
      // Iterate over direct descendents of lists
      for (let node = domElement.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === Node.TEXT_NODE &&
            trim(node.textContent).length > 0) {
          // Non-empty text node inside list should show error
          // This is a common student mistake
          reporter.warn('invalid-list-children', '', domElement);
          break;
        }
      }
    }
  });
}

class HtmlInspectorValidator extends Validator {
  constructor(source) {
    super(source, 'html', errorMap);
    this._doc = new DOMParser().parseFromString(this._source, 'text/html');
  }

  async _getRawErrors() {
    if (isNull(this._doc.documentElement)) {
      return Promise.resolve([]);
    }

    const {HTMLInspector} = await importLinters();

    HTMLInspector.rules.add('validate-list-children',
      invalidListChildrenValidator);

    return new Promise((resolve) => {
      HTMLInspector.inspect({
        domRoot: this._doc.documentElement,
        useRules: ['validate-element-location', 'validate-list-children'],
        onComplete: resolve,
      });
    });
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

export default source => new HtmlInspectorValidator(source).getAnnotations();
