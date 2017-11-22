import test from 'tape';
import Beautify from 'js-beautify';
import {format, indexToNonWhitespaceIndex, nonWhitespaceIndexToIndex}
  from '../../../src/util/formatter';

test('index helpers work at bounds', (assert) => {
  const string = '0 1 23 456 7';

  assert.equal(indexToNonWhitespaceIndex(string, 0), 0);
  assert.equal(nonWhitespaceIndexToIndex(string, 0), 0);

  assert.equal(indexToNonWhitespaceIndex(string, string.length), 8);
  assert.equal(nonWhitespaceIndexToIndex(string, 8), string.length);

  assert.end();
});

test('index helpers work in the middle of words', (assert) => {
  const string = '01 23 456 78';

  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('1')), 1);
  assert.equal(nonWhitespaceIndexToIndex(string, 1), string.indexOf('1'));

  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('3')), 3);
  assert.equal(nonWhitespaceIndexToIndex(string, 3), string.indexOf('3'));

  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('5')), 5);
  assert.equal(nonWhitespaceIndexToIndex(string, 5), string.indexOf('5'));

  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('8')), 8);
  assert.equal(nonWhitespaceIndexToIndex(string, 8), string.indexOf('8'));

  assert.end();
});

test('index helpers work at the end of words', (assert) => {
  const string = '01 23 456 78';

  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('1') + 1), 2);
  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('1') + 2), 2);
  assert.equal(nonWhitespaceIndexToIndex(string, 2), string.indexOf('1') + 1);

  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('6') + 1), 7);
  assert.equal(indexToNonWhitespaceIndex(string, string.indexOf('6') + 2), 7);
  assert.equal(nonWhitespaceIndexToIndex(string, 7), string.indexOf('6') + 1);

  assert.end();
});

// Placeholders for the cursor
const START = 'START';
const END = 'END';

function codeAndCursor(codeWithCursors) {
  let code = codeWithCursors;

  const startIndex = code.indexOf(START);
  code = code.replace(START, '');

  const endIndex = code.indexOf(END);
  code = code.replace(END, '');

  return {code, startIndex, endIndex};
}

function formatTest({mode, original, expected, options}) {
  return (assert) => {
    const {
      code: code,
      startIndex: cursorStart,
      endIndex: cursorEnd,
    } = codeAndCursor(original);

    const {
      code: expectedCode,
      startIndex: expectedStart,
      endIndex: expectedEnd,
    } = codeAndCursor(expected);

    const {
      code: newCode,
      startIndex: newStart,
      endIndex: newEnd,
    } = format(Beautify, code, cursorStart, cursorEnd, mode, options);

    assert.equal(newCode, expectedCode);
    assert.deepEqual([newStart, newEnd], [expectedStart, expectedEnd]);

    assert.end();
  };
}

test('html no-op with cursor', formatTest({
  title: 'html no-op with cursor',
  mode: 'html',
  options: {indent_char: ' ', indent_size: 2},

  original: `<html>${START}${END}</html>`,
  expected: `<html>${START}${END}\n\n</html>`,
}));

test('html with cursor', formatTest({
  mode: 'html',
  options: {indent_char: ' ', indent_size: 2},

  original: `<p>\nasdf${START}${END}\n   </p>`,
  expected: `<p>\n  asdf${START}${END}\n</p>`,
}));

test('html with cursor in the middle of a word', formatTest({
  mode: 'html',
  options: {indent_char: ' ', indent_size: 2},

  original: `<p>\nas${START}${END}df\n   </p>`,
  expected: `<p>\n  as${START}${END}df\n</p>`,
}));

test('html with cursor in the middle of a word', formatTest({
  mode: 'html',
  options: {indent_char: ' ', indent_size: 2},

  original: `
<!DOCTYPE html>
<html>
<head>
<title>Pa${START}${END}ge Title</title>
</head>
<body>
</body>
</html>`.trim(),
  expected: `
<!DOCTYPE html>
<html>

  <head>
    <title>Pa${START}${END}ge Title</title>
  </head>

  <body>
  </body>

</html>`.trim(),
}));

test('html with cursor on a range', formatTest({
  mode: 'html',
  options: {indent_char: ' ', indent_size: 2},

  original: `
<!DOCTYPE html>
<html>
<head>
<title>Pa${START}ge Title</title>
</head>
<body>
</bo${END}dy>
</html>`.trim(),
  expected: `
<!DOCTYPE html>
<html>

  <head>
    <title>Pa${START}ge Title</title>
  </head>

  <body>
  </bo${END}dy>

</html>`.trim(),
}));
