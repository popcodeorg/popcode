import reduceReducers from 'reduce-reducers';
import {combineReducers} from 'redux-immutable';

import clients from './clients';
import compiledProjects from './compiledProjects';
import console from './console';
import currentProject from './currentProject';
import errors from './errors';
import projects, {reduceRoot as reduceRootForProjects} from './projects';
import resizableFlex from './resizableFlex';
import ui from './ui';
import user from './user';

const reduceRoot = combineReducers({
  user,
  projects,
  currentProject,
  errors,
  ui,
  clients,
  compiledProjects,
  console,
  resizableFlex,
});

export default reduceReducers(reduceRoot, reduceRootForProjects);
