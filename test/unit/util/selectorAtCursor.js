import test from 'tape';

import {selectorAtCursor} from '../../../src/util/selectorAtCursor';
import {css, javascript} from '../../data/acceptance.json';

test('css rules', (t) => {
  const [source] = css;

  t.test('cursor in css rule returns correct selector', (assert) => {
    const cursor = {column: 1, row: 0};
    assert.isEqual(selectorAtCursor(source, cursor, 'css'), 'body');
    assert.end();
  });

  t.test('cursor outside css rule returns null', (assert) => {
    const cursor = {column: 1, row: 2};
    assert.isEqual(selectorAtCursor(source, cursor, 'css'), null);
    assert.end();
  });
});

test('jquery selectors that can be analyzed', (t) => {
  const [source] = javascript;

  t.test('cursor in jquery rule with string return selector', (assert) => {
    const cursor = {column: 5, row: 1};
    assert.isEqual(
      selectorAtCursor(source, cursor, 'javascript'),
      '#submit-name',
    );
    assert.end();
  });

  t.test('cursor outside jquery rule with string returns null', (assert) => {
    const cursor = {column: 2, row: 0};
    assert.isEqual(
      selectorAtCursor(source, cursor, 'javascript'),
      null,
    );
    assert.end();
  });
});
