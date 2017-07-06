import {combineReducers} from 'redux-immutable';
import reduceReducers from 'reduce-reducers';
import user from './user';
import projects, {reduceRoot as reduceRootForProjects} from './projects';
import currentProject from './currentProject';
import errors from './errors';
import ui from './ui';
import clients from './clients';

const reduceRoot = combineReducers({
  user,
  projects,
  currentProject,
  errors,
  ui,
  clients,
});

export default reduceReducers(
  reduceRoot,
  reduceRootForProjects,
);
