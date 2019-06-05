import {Factory} from 'rosie';

export const consoleErrorFactory = new Factory().attrs({
  name: 'TypeError',
  raw: 'You tried to call `i()` as a function, but `i` is not a function.',
  reason: 'not-a-function',
  text: 'You tried to call `i()` as a function, but `i` is not a function.',
  type: 'error',
});
