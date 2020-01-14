import {projectCreated, updateProjectSource} from '../../actions/projects';
import {userAuthenticated} from '../../actions/user';
import reduce from '../../reducers';
import saveProject from '../saveProject';

import {credentialFactory, userFactory} from '@factories/clients/firebase';

const defaultState = reduce(undefined, {type: 'NONE'});

jest.mock('../../clients/firebase.js');

test('not pristine project should save', async () => {
  const mockCredential = credentialFactory.build();
  const mockUser = userFactory.build();
  const state = [
    projectCreated('123456'),
    updateProjectSource('123456', 'css', ''),
    userAuthenticated(mockUser, [mockCredential]),
  ].reduce(reduce, defaultState);
  const getState = jest.fn(() => state);
  const {type} = await saveProject.process({getState});
  expect(getState).toHaveBeenCalledWith();
  expect(type).toBe('PROJECT_SUCCESSFULLY_SAVED');
});

test('pristine project should not save', async () => {
  const mockCredential = credentialFactory.build();
  const mockUser = userFactory.build();
  let state = reduce(defaultState, projectCreated('123456'));
  state = reduce(state, userAuthenticated(mockUser, [mockCredential]));
  const getState = jest.fn(() => state);
  const result = await saveProject.process({getState});
  expect(result).toBe(null);
});

test('not logged in should open login prompt', async () => {
  const getState = jest.fn(() => defaultState);
  const {type} = await saveProject.process({getState});
  expect(getState).toHaveBeenCalledWith();
  expect(type).toBe('OPEN_LOGIN_PROMPT');
});
