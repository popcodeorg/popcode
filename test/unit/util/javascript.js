import test from 'tape';

import {hasExpressionStatement} from '../../../src/util/javascript';

test('empty statement is not an expression statement', (assert) => {
  assert.isEqual(hasExpressionStatement(';'), false);
  assert.end();
});

test('variable definition is not an expression statement',
  (assert) => {
    assert.isEqual(hasExpressionStatement('let i = 1'), false);
    assert.end();
  });

test('loop is not an expression statement', (assert) => {
  assert.isEqual(
    hasExpressionStatement('for (let i = 0; i < 10; ++i) console.log(i);'),
    false);
  assert.end();
});

test('malformed expression does not contain an expression statement',
  (assert) => {
    assert.isEqual(hasExpressionStatement('1 + 2 +'), false);
    assert.end();
  });

test('valid expression contains an expression statement', (assert) => {
  assert.isEqual(hasExpressionStatement('window.nothingHere'), true);
  assert.end();
});

test('multiple statements contain an expression statement', (assert) => {
  assert.isEqual(hasExpressionStatement('let i = 1; 2; let j = 3'), true);
  assert.end();
});
