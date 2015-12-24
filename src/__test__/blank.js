var Immutable = require('immutable');

exports.project = {
  projectKey: '12345',
  sources: {html: '', css: '', javascript: ''},
  libraries: [],
};

exports.state = {
  currentProject: new Immutable.Map({projectKey: exports.project.projectKey}),
  projects: Immutable.fromJS({12345: exports.project}),
};
