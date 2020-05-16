import almostEqual from 'almost-equal';
// eslint-disable-next-line import/no-namespace
import * as immutableMatchers from 'jest-immutable-matchers';
import every from 'lodash-es/every';
import zip from 'lodash-es/zip';

jest.addMatchers(immutableMatchers);

expect.extend({
  toHaveAlmostEqualElements(received, expected) {
    const pass =
      received.length === expected.length &&
      every(zip(received, expected), ([value1, value2]) =>
        almostEqual(value1, value2),
      );
    if (pass) {
      return {
        pass: true,
        message: () =>
          `expected ${received} not to contain approximately equal elements to ${expected}`,
      };
    }
    return {
      pass: false,
      message: () =>
        `expected ${received} to contain approximately equal elements to ${expected}`,
    };
  },
});

function createRange() {
  // createRange is always called with a Document context
  /* eslint-disable no-invalid-this, consistent-this */
  const context = this;
  let end;
  return {
    setEndBefore(el) {
      end = el;
    },

    // Finds all text nodes up to the target node, and returns them
    // This is used to count newlines for the error reporting
    toString() {
      let hasFoundNode = false;
      const newLines = [];
      const iterator = context.createNodeIterator(
        context.documentElement,
        NodeFilter.SHOW_ALL,
        {
          acceptNode(node) {
            if (hasFoundNode) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.isEqualNode(end)) {
              hasFoundNode = true;
            }
            if (node.nodeType === Node.TEXT_NODE) {
              newLines.push(node.textContent);
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );
      const nodes = [];
      let node;
      while ((node = iterator.nextNode())) {
        nodes.push(node);
      }
      return newLines.join('');
    },
  };
}
global.Document.prototype.createRange = createRange;
