// This rule checks for any unexpected tags or text that
// don't get caught by other validators, specifically:
//
// * Any tags or text outside the <html> element
// * Any text that is inside the <html> element but not part
//   of the <head> or <body> tags

import findLastIndex from 'lodash-es/findLastIndex';

import Code from './Code';

export default class MismatchedTag {
  constructor() {
    this._openTagStack = [];
    this._locationsWithOutsideTags = [];
  }

  openTag(location, {name}) {
    if (
      this._isOutsideAcceptableContainer() &&
      name !== 'html' &&
      name !== 'head' &&
      name !== 'body'
    ) {
      this._locationsWithOutsideTags.push({
        location,
        type: `<${name}> tags`,
        outsideTag: this._openTagStack.length === 0 ? 'html' : 'body',
      });
    }

    this._openTagStack.push({location, name});
  }

  closeTag(location, name) {
    const openIndex = findLastIndex(
      this._openTagStack,
      openTag => openTag.name === name,
    );

    const isOpened = openIndex >= 0;
    if (isOpened) {
      this._openTagStack.splice(openIndex);
    }
  }

  text(location, text) {
    const trimmedText = text.trim();
    if (trimmedText && this._isOutsideAcceptableContainer()) {
      this._locationsWithOutsideTags.push({
        location,
        type: 'text',
        outsideTag: this._openTagStack.length === 0 ? 'html' : 'body',
      });
    }
  }

  _isOutsideAcceptableContainer() {
    return this._openTagStack.length === 0 || (
      this._openTagStack.length === 1 &&
      this._openTagStack[0].name === 'html'
    );
  }

  * done() {
    for (const outside of this._locationsWithOutsideTags) {
      yield {
        code: Code.MARKUP_OUTSIDE_CONTAINER,
        location: outside.location,
        type: outside.type,
        outsideTag: outside.outsideTag,
      };
    }
  }
}
