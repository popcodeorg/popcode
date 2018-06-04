import test from 'tape';

import Code from '../../../../src/validations/html/rules/Code';
import MismatchedTag
  from '../../../../src/validations/html/rules/MismatchedTag';

test('misplaced close tag', (t) => {
  const rule = new MismatchedTag();
  rule.openTag({row: 0, column: 10}, {name: 'div'});
  rule.openTag({row: 1, column: 11}, {name: 'p'});
  rule.closeTag({row: 2, column: 12}, 'div');
  rule.closeTag({row: 3, column: 13}, 'p');
  t.deepEqual(
    Array.from(rule.done()),
    [
      {
        code: Code.MISPLACED_CLOSE_TAG,
        openTag: {
          location: {row: 1, column: 11},
          name: 'p',
        },
        closeTag: {
          location: {row: 2, column: 12},
          name: 'div',
        },
        match: {row: 3, column: 13},
      },
    ]);
  t.end();
});

test('unclosed tag', (t) => {
  const rule = new MismatchedTag();
  rule.openTag({row: 0, column: 10}, {name: 'div'});
  rule.openTag({row: 1, column: 11}, {name: 'p'});
  rule.closeTag({row: 2, column: 12}, 'div');
  t.deepEqual(
    Array.from(rule.done()),
    [
      {
        code: Code.UNCLOSED_TAG,
        openTag: {
          location: {row: 1, column: 11},
          name: 'p',
        },
        closeTag: {
          location: {row: 2, column: 12},
          name: 'div',
        },
      },
    ]);
  t.end();
});

test('unopened tag', (t) => {
  const rule = new MismatchedTag();
  rule.openTag({row: 0, column: 10}, {name: 'div'});
  rule.closeTag({row: 1, column: 11}, 'div');
  rule.closeTag({row: 2, column: 12}, 'p');
  t.deepEqual(
    Array.from(rule.done()),
    [
      {
        code: Code.UNOPENED_TAG,
        closeTag: {
          location: {row: 2, column: 12},
          name: 'p',
        },
      },
    ]);
  t.end();
});

test('mismatched tag okay', (t) => {
  const rule = new MismatchedTag();
  rule.openTag({row: 0, column: 10}, {name: 'div'});
  rule.closeTag({row: 1, column: 11}, 'div');
  t.deepEqual(Array.from(rule.done()), []);
  t.end();
});
