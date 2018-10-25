import test from 'tape';

import selectorAtCursor from '../../../src/util/selectorAtCursor';

const selectors = [
  {
    selector: 'body',
    loc: {
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 3,
        column: 1,
      },
    },
  }, {
    selector: '#gallery',
    loc: {
      start: {
        line: 5,
        column: 1,
      },
      end: {
        line: 9,
        column: 1,
      },
    },
  },
];

test('finds a selector on the start line', (assert) => {
  const cursor = {column: 1, row: 0};

  assert.isEqual(selectorAtCursor(selectors, cursor), 'body');
  assert.end();
});

test('does not find a selector between lines', (assert) => {
  const cursor = {column: 1, row: 3};

  assert.isEqual(selectorAtCursor(selectors, cursor), null);
  assert.end();
});
