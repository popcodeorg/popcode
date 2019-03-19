import constant from 'lodash-es/constant';

export default {
  getParser: constant({
    isOS: jest.fn().mockReturnValue(false),
  }),
};
