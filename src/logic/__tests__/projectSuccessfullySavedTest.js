import projectSuccessfullySaved from '../projectSuccessfullySaved';

import {showSaveIndicator, hideSaveIndicator} from '../../actions/ui';

test('should show project saved successfully', async () => {
  jest.useFakeTimers();
  const dispatch = jest.fn();
  const data = {};
  const logicDone = new Promise(resolve =>
    projectSuccessfullySaved.process(data, dispatch, resolve),
  );
  expect(dispatch).toHaveBeenCalledWith(showSaveIndicator());
  expect(dispatch).not.toHaveBeenCalledWith(hideSaveIndicator());
  jest.advanceTimersByTime(1000);
  await logicDone;
  expect(dispatch).toHaveBeenCalledWith(hideSaveIndicator());
});
