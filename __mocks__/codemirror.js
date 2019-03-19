import assignIn from 'lodash-es/assignIn';
import tap from 'lodash-es/tap';

export const Doc = jest.fn(() => ({}));

export default tap(
  jest.fn(() => ({
    focus: jest.fn(),
    getDoc: jest.fn().mockReturnValue({setCursor: jest.fn()}),
    on: jest.fn(),
    off: jest.fn(),
    performLint: jest.fn(),
    scrollIntoView: jest.fn(),
    setOption: jest.fn(),
    setSize: jest.fn(),
    swapDoc: jest.fn(),
    getValue: jest.fn().mockReturnValue(''),
    setValue: jest.fn(),
  })),
  CodeMirror => assignIn(CodeMirror, {Doc}),
);
