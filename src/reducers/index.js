import {combineReducers} from 'redux';
import user from './user';
import projects from './projects';
import currentProject from './currentProject';
import errors from './errors';
import runtimeErrors from './runtimeErrors';
import ui from './ui';
import clients from './clients';

const reducers = combineReducers({
  user,
  projects,
  currentProject,
  errors,
  runtimeErrors,
  ui,
  clients,
});

export default reducers;
