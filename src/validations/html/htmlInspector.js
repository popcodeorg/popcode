import last from 'lodash/last';
import isNull from 'lodash/isNull';
import trim from 'lodash/trim';
import {localizedArrayToSentence} from '../../util/arrayToSentence';
import retryingFailedImports from '../../util/retryingFailedImports';
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
  'text-elements-as-list-children': (error) => {
    const tag = error.context.tagName.toLowerCase();
    let requiredChild = 'li';

    if (tag === 'dl') {
      requiredChild = 'dd> or <dt';
    }

    return {
      reason: 'text-elements-as-list-children',
      payload: {
        tag,
        children: requiredChild,
        textContent: error.message,
      },
    };
  },
};

function noListsWithTextChildrenValidator(listener, reporter) {
  listener.on('element', (elementName, domElement) => {
    if (
      domElement.childNodes.length &&
      (elementName === 'ul' || elementName === 'ol' || elementName === 'dl')
    ) {
      for (const node of domElement.childNodes) {
        const textContent = trim(node.textContent);
        if (
          node.nodeType === Node.TEXT_NODE &&
          textContent.length > 0
        ) {
          reporter.warn(
            'text-elements-as-list-children',
            textContent,
            domElement,
          );
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

    const HTMLInspector = await retryingFailedImports(() => import(
      /* webpackChunkName: 'mainAsync' */
      'html-inspector',
    ));

    HTMLInspector.rules.add(
      'validate-list-children',
      noListsWithTextChildrenValidator,
    );

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
