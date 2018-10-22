import test from 'tape';

import {selectorAtCursor} from '../../../src/util/selectorAtCursor';
import {css} from '../../data/acceptance.json';

const [source] = css;

test('cursor in css rule returns correct selector', (assert) => {
  const cursor = {column: 1, row: 0};
  assert.isEqual(selectorAtCursor(source, cursor, 'css'), 'body');
  assert.end();
});

test('cursor outside css rule returns null', (assert) => {
  const cursor = {column: 1, row: 2};
  assert.isEqual(selectorAtCursor(source, cursor, 'css'), null);
  assert.end();
});


