// This rule checks for any unexpected tags or text that
// don't get caught by other validators, specifically:
//
// * Any tags or text outside the <html> element
// * Any text that is inside the <html> element but not part
//   of the <head> or <body> tags

import findLastIndex from 'lodash-es/findLastIndex';

import Code from './Code';

export default class NodeOutsideBody {
  constructor() {
    this._openTagStack = [];
    this._invalidTextLocations = [];
    this._invalidTagLocations = [];
  }

  openTag(location, {name}) {
    if (
      (this._isTopLevel() && name !== 'html') ||
      (this._isInsideHtmlTag() && name !== 'head' && name !== 'body')
    ) {
      this._invalidTagLocations.push({
        location,
        tagName: name,
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
    if (
      trimmedText &&
      (this._isTopLevel() ||
        this._isInsideHtmlTag() ||
        this._isDirectChildOfHead())
    ) {
      const matchingWhitespaces = text.match(/^(\s+)/gu);

      if (matchingWhitespaces) {
        const whitespaces = matchingWhitespaces[0].split('\n');
        const blankLines = whitespaces.length - 1;
        const columnOffset = whitespaces[blankLines].length;
        this._invalidTextLocations.push({
          location: {
            row: location.row + blankLines,
            column: columnOffset,
          },
        });
      } else {
        this._invalidTextLocations.push({location});
      }
    }
  }

  _isTopLevel() {
    return this._openTagStack.length === 0;
  }

  _isInsideHtmlTag() {
    return (
      this._openTagStack.length === 1 && this._openTagStack[0].name === 'html'
    );
  }

  _isDirectChildOfHead() {
    return (
      this._openTagStack.length === 2 &&
      this._openTagStack[0].name === 'html' &&
      this._openTagStack[1].name === 'head'
    );
  }

  *done() {
    for (const {location} of this._invalidTextLocations) {
      yield {
        code: Code.INVALID_TEXT_OUTSIDE_BODY,
        location,
      };
    }
    for (const {location, tagName} of this._invalidTagLocations) {
      yield {
        code: Code.INVALID_TAG_OUTSIDE_BODY,
        tagName,
        location,
      };
    }
  }
}
