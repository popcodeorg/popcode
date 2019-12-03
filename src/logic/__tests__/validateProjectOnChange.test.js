import validateProjectOnChange from '../validateProjectOnChange';

import Analyzer from '../../analyzers';
import validateSource from '../helpers/validateSource';
import {getCurrentProject} from '../../selectors';

jest.mock('../../analyzers');
jest.mock('../helpers/validateSource');
jest.mock('../../selectors', () => ({
  getCurrentProject: jest.fn(),
}));

const dummyState = {};

test('should validate project on change', async () => {
  const dispatch = jest.fn();
  const done = jest.fn();
  const res = await validateProjectOnChange.process(
    {
      getState: () => dummyState,
      action: {payload: {language: 'html', newValue: ''}},
    },
    dispatch,
    done,
  );
  expect(Analyzer).toHaveBeenCalled();
  expect(getCurrentProject).toHaveBeenCalled();
  expect(validateSource).toHaveBeenCalled();
});
