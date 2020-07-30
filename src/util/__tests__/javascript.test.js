import {hasExpressionStatement} from '../javascript';

test('empty statement is not an expression statement', () => {
  expect(hasExpressionStatement(';')).toBe(false);
});

test('variable definition is not an expression statement', () => {
  expect(hasExpressionStatement('let i = 1')).toBe(false);
});

test('loop is not an expression statement', () => {
  expect(
    hasExpressionStatement('for (let i = 0; i < 10; ++i) console.log(i);'),
  ).toBe(false);
});

test('malformed expression does not contain an expression statement', () => {
  expect(hasExpressionStatement('1 + 2 +')).toBe(false);
});

test('valid expression contains an expression statement', () => {
  expect(hasExpressionStatement('window.nothingHere')).toBe(true);
});

test('multiple statements contain an expression statement', () => {
  expect(hasExpressionStatement('let i = 1; 2; let j = 3')).toBe(true);
});
