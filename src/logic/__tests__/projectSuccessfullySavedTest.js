import projectSuccessfullySaved from '../projectSuccessfullySaved';

import {showSaveIndicator, hideSaveIndicator} from '../../actions/ui';

test('should show project saved successfully', async () => {
  jest.useFakeTimers();
  const dispatch = jest.fn();
  const done = jest.fn();
  const data = {};
  projectSuccessfullySaved.process(data, dispatch, done);
  expect(dispatch).toHaveBeenCalledWith(showSaveIndicator());
  expect(dispatch).not.toHaveBeenCalledWith(hideSaveIndicator());
  jest.advanceTimersByTime(1000);
  expect(dispatch).toHaveBeenCalledWith(hideSaveIndicator());
  expect(done).toHaveBeenCalledWith();
});
