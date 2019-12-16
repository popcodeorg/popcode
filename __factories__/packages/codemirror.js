import {Factory} from 'rosie';

export const position = new Factory().attrs({
  line: 0,
  ch: 0,
});

export const change = new Factory()
  .attr('from', () => position.build())
  .attr('to', () => position.build())
  .attrs({
    text: 'c',
    removed: '',
    origin: '+input',
  });
