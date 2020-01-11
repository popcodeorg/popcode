import reduceReducers from 'reduce-reducers';
import {reducer as formReducer} from 'redux-form/immutable';
import {combineReducers} from 'redux-immutable';

import clients from './clients';
import compiledProjects from './compiledProjects';
import console from './console';
import currentProject from './currentProject';
import errors from './errors';
import googleClassroom from './googleClassroom';
import projects, {reduceRoot as reduceRootForProjects} from './projects';
import resizableFlex from './resizableFlex';
import ui from './ui';
import user from './user';

const reduceRoot = combineReducers({
  user,
  projects,
  currentProject,
  errors,
  googleClassroom,
  ui,
  clients,
  compiledProjects,
  console,
  resizableFlex,
  form: formReducer,
});

export default reduceReducers(reduceRoot, reduceRootForProjects);
