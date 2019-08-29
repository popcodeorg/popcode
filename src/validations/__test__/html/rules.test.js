import Code from '../../html/rules/Code';
import MismatchedTag from '../../html/rules/MismatchedTag';

describe('html rules', () => {
  test('misplaced close tag', () => {
    const rule = new MismatchedTag();
    rule.openTag({row: 0, column: 10}, {name: 'div'});
    rule.openTag({row: 1, column: 11}, {name: 'p'});
    rule.closeTag({row: 2, column: 12}, 'div');
    rule.closeTag({row: 3, column: 13}, 'p');
    expect(Array.from(rule.done())).toEqual([
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
  });

  test('unclosed tag', () => {
    const rule = new MismatchedTag();
    rule.openTag({row: 0, column: 10}, {name: 'div'});
    rule.openTag({row: 1, column: 11}, {name: 'p'});
    rule.closeTag({row: 2, column: 12}, 'div');
    expect(Array.from(rule.done())).toEqual([
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
  });

  test('unopened tag', () => {
    const rule = new MismatchedTag();
    rule.openTag({row: 0, column: 10}, {name: 'div'});
    rule.closeTag({row: 1, column: 11}, 'div');
    rule.closeTag({row: 2, column: 12}, 'p');
    expect(Array.from(rule.done())).toEqual([
      {
        code: Code.UNOPENED_TAG,
        closeTag: {
          location: {row: 2, column: 12},
          name: 'p',
        },
      },
    ]);
  });

  test('mismatched tag okay', () => {
    const rule = new MismatchedTag();
    rule.openTag({row: 0, column: 10}, {name: 'div'});
    rule.closeTag({row: 1, column: 11}, 'div');
    expect(Array.from(rule.done())).toEqual([]);
  });
});
