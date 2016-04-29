import {combineReducers} from 'redux';
import user from './user';
import projects from './projects';
import currentProject from './currentProject';
import errors from './errors';
import runtimeErrors from './runtimeErrors';
import delayErrorDisplay from './delayErrorDisplay';
import ui from './ui';

const reducers = combineReducers({
  user,
  projects,
  currentProject,
  errors,
  runtimeErrors,
  delayErrorDisplay,
  ui,
});

export default reducers;
