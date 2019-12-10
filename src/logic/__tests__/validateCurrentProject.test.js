import validateCurrentProject from '../validateCurrentProject';

import Analyzer from '../../analyzers';
import validateSource from '../helpers/validateSource';
import {getCurrentProject} from '../../selectors';

const mockHtmlSource = '<html></html>';
const mockCssSource = 'div {}';

jest.mock('../../analyzers');
jest.mock('../helpers/validateSource');
jest.mock('../../selectors', () => ({
  getCurrentProject: jest.fn(() => ({
    sources: {
      html: mockHtmlSource,
      css: mockCssSource,
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
  const analyzer = new Analyzer(analyzerPayload);
  expect(validateSource.mock.calls).toEqual([
    [
      {
        language: 'html',
        source: mockHtmlSource,
        projectAttributes: analyzer,
      },
      dispatch,
    ],
    [
      {
        language: 'css',
        source: mockCssSource,
        projectAttributes: analyzer,
      },
      dispatch,
    ],
  ]);
  expect(done).toHaveBeenCalled();
});
