// If any spare unopened tag exists afterward, diagnose it and only yield
// MISPLACED_CLOSE_TAG.
//
// Otherwise:
//
// A mismatched close tag that has been opened means the case
//
// <div>
//   <span>
// </div>
//
// so yield UNCLOSED_TAG.
//
// A mismatched close tag that has yet to be opened means the case
//
// <div>
//   </span>
// </div>
//
// so yield UNOPENED_TAG.

import findLastIndex from 'lodash-es/findLastIndex';

import Code from './Code';

export default class {
  constructor() {
    this._openTagStack = [];
    this._mismatchStacksByOpenName = new Map();
    this._closeTagMisplacements = [];
    this._unopenedTags = [];
  }

  openTag(location, {name}) {
    this._openTagStack.push({location, name});
  }

  closeTag(location, name) {
    const openIndex = findLastIndex(
      this._openTagStack,
      openTag => openTag.name === name,
    );

    const isOpened = openIndex >= 0;
    if (isOpened) {
      for (let i = openIndex + 1; i < this._openTagStack.length; ++i) {
        const openTag = this._openTagStack[i];
        const mismatch = {
          openTag,
          closeTag: {location, name},
        };
        const mismatches = this._mismatchStacksByOpenName.get(openTag.name);
        if (mismatches) {
          mismatches.push(mismatch);
        } else {
          this._mismatchStacksByOpenName.set(openTag.name, [mismatch]);
        }
      }
      this._openTagStack.splice(openIndex);
    } else {
      const mismatchStack = this._mismatchStacksByOpenName.get(name) || [];
      const matchingMismatch = mismatchStack.pop();
      if (matchingMismatch) {
        const {openTag, closeTag} = matchingMismatch;
        this._closeTagMisplacements.push({match: location, openTag, closeTag});
      } else {
        this._unopenedTags.push({location, name});
      }
    }
  }

  * done() {
    for (const mismatches of this._mismatchStacksByOpenName.values()) {
      for (const {openTag, closeTag} of mismatches) {
        yield {code: Code.UNCLOSED_TAG, openTag, closeTag};
      }
    }

    for (const {openTag, closeTag, match} of this._closeTagMisplacements) {
      yield {code: Code.MISPLACED_CLOSE_TAG, openTag, closeTag, match};
    }

    for (const closeTag of this._unopenedTags) {
      yield {code: Code.UNOPENED_TAG, closeTag};
    }
  }
}
