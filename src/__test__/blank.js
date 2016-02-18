import Immutable from 'immutable';

const project = {
  projectKey: '12345',
  sources: {html: '', css: '', javascript: ''},
  enabledLibraries: [],
};

const state = {
  currentProject: new Immutable.Map({projectKey: exports.project.projectKey}),
  projects: Immutable.fromJS({12345: exports.project}),
};

export {project, state};
