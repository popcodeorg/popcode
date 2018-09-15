import once from 'lodash-es/once';

export default once(
  () => 'flex-grow' in getComputedStyle(document.documentElement),
);
