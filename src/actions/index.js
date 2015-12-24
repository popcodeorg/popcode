var Storage = require('../services/Storage');
var validations = require('../validations');

function generateProjectKey() {
  var date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

exports.createProject = function() {
  return function(dispatch, getState) {
    dispatch({
      type: 'PROJECT_CREATED',
      payload: {
        projectKey: generateProjectKey(),
      },
    });

    var state = getState();
    var projectKey = state.currentProject.get('projectKey');
    var project = state.projects.get(projectKey);

    Storage.save(project.toJS());
    Storage.setCurrentProjectKey(projectKey);
  };
};

exports.loadCurrentProjectFromStorage = function() {
  return function(dispatch, getState) {
    Storage.getCurrentProjectKey().then(function(projectKey) {
      if (projectKey) {
        Storage.load(projectKey).then(function(project) {
          dispatch({
            type: 'CURRENT_PROJECT_LOADED_FROM_STORAGE',
            payload: {project: project},
          });
        });
      } else {
        exports.createProject()(dispatch, getState);
      }
    });
  };
};

exports.updateProjectSource = function(projectKey, language, newValue) {
  return function(dispatch, getState) {
    dispatch({
      type: 'PROJECT_SOURCE_EDITED',
      payload: {
        projectKey: projectKey,
        language: language,
        newValue: newValue,
      },
    });

    var state = getState();
    var currentProject = state.projects.get(
      state.currentProject.get('projectKey')
    );
    Storage.save(currentProject.toJS());

    dispatch({
      type: 'VALIDATING_SOURCE',
    });

    var validate = validations[language];
    validate(newValue).then(function(errors) {
      dispatch({
        type: 'VALIDATED_SOURCE',
        payload: {errors: errors},
      });
    });
  };
};

exports.changeCurrentProject = function(projectKey) {
  return function(dispatch) {
    dispatch({
      type: 'CURRENT_PROJECT_CHANGED',
      payload: {projectKey: projectKey},
    });

    Storage.setCurrentProjectKey(projectKey);
  };
};
