import {combineReducers} from 'redux';
import user from './user';
import projects from './projects';
import currentProject from './currentProject';
import errors from './errors';
import runtimeErrors from './runtimeErrors';
import ui from './ui';

const reducers = combineReducers({
  user,
  projects,
  currentProject,
  errors,
  runtimeErrors,
  ui,
});

export default reducers;
