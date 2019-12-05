import validateProjectOnChange from '../validateProjectOnChange';

import Analyzer from '../../analyzers';
import validateSource from '../helpers/validateSource';
import {getCurrentProject} from '../../selectors';

jest.mock('../../analyzers');
jest.mock('../helpers/validateSource');
jest.mock('../../selectors', () => ({
  getCurrentProject: jest.fn(x => x),
}));

const dummyState = {};

test('should validate project on change', async () => {
  const language = 'html';
  const newValue = 'dummy new value';
  const dispatch = jest.fn();
  const done = jest.fn();
  await validateProjectOnChange.process(
    {
      getState: () => dummyState,
      action: {payload: {language, newValue}},
    },
    dispatch,
    done,
  );
  expect(getCurrentProject).toHaveBeenCalledWith(dummyState);
  const analyzerPayload = getCurrentProject(dummyState);
  expect(Analyzer).toHaveBeenCalledWith(analyzerPayload);
  expect(validateSource).toHaveBeenCalledWith(
    {
      language,
      source: newValue,
      projectAttributes: new Analyzer(getCurrentProject(dummyState)),
    },
    dispatch,
  );
  expect(done).toHaveBeenCalled();
});
