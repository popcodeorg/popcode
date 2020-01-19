import Enum from 'enum';

export default new Enum(
  [
    'MISPLACED_CLOSE_TAG',
    'UNCLOSED_TAG',
    'UNOPENED_TAG',
    'INVALID_TEXT_OUTSIDE_BODY',
    'INVALID_TAG_OUTSIDE_BODY',
  ],
  {name: 'Code'},
);
