export default {
  init: jest.fn(),

  t(key) {
    if (key === 'utility.or') {
      return ' or ';
    }
    return '';
  },
};
