import validateCurrentProject from '../validateCurrentProject';

import Analyzer from '../../analyzers';
import validateSource from '../helpers/validateSource';
import { getCurrentProject } from '../../selectors';

jest.mock('../../analyzers');
jest.mock('../helpers/validateSource');
jest.mock('../../selectors', () => ({
  getCurrentProject: jest.fn(() => ({
    sources: {
      html: '<html></html>',
      css: 'div {}',
    },
  })),
}));

const dummyState = {};

test('should validate current project', async () => {
  const dispatch = jest.fn();
  const done = jest.fn();
  await validateCurrentProject.process(
    {
      getState: () => dummyState,
    },
    dispatch,
    done,
  );
  expect(getCurrentProject).toHaveBeenCalledWith(dummyState);
  const analyzerPayload = getCurrentProject(dummyState);
  expect(Analyzer).toHaveBeenCalledWith(analyzerPayload);

  expect(done).toHaveBeenCalled();
});
