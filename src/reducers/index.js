import {combineReducers} from 'redux-immutable';
import reduceReducers from 'reduce-reducers';
import {reducer as formReducer} from 'redux-form/immutable';

import user from './user';
import projects, {reduceRoot as reduceRootForProjects} from './projects';
import console from './console';
import currentProject from './currentProject';
import errors from './errors';
import googleClassroom from './googleClassroom';
import ui from './ui';
import clients from './clients';
import compiledProjects from './compiledProjects';
import resizableFlex from './resizableFlex';

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
