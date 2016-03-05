import Immutable from 'immutable';

const project = {
  projectKey: '12345',
  sources: {html: '', css: '', javascript: ''},
  enabledLibraries: [],
};

const state = {
  currentProject: new Immutable.Map({projectKey: project.projectKey}),
  projects: Immutable.fromJS({12345: project}),
  user: new Immutable.Map({authenticated: false}),
  delayErrorDisplay: false,
  errors: {},
  runtimeErrors: [],
};

export {project, state};
