import extend from 'lodash-es/extend';
import tap from 'lodash-es/tap';

export const Doc = jest.fn(() => ({}));

export default tap(
  jest.fn(() => ({
    getDoc: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    performLint: jest.fn(),
    setOption: jest.fn(),
    setSize: jest.fn(),
    swapDoc: jest.fn(),
    getValue: jest.fn(() => ''),
    setValue: jest.fn(),
  })),
  CodeMirror => extend(CodeMirror, {Doc}),
);
