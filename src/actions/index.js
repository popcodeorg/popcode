var Storage = require('../services/Storage');
var validations = require('../validations');

function generateProjectKey() {
  var date = new Date();
  return (date.getTime() * 1000 + date.getMilliseconds()).toString();
}

function getCurrentProject(state) {
  var projectKey = state.currentProject.get('projectKey');
  if (projectKey) {
    return state.projects.get(projectKey);
  }
}

function validateSource(dispatch, language, source) {
  dispatch({
    type: 'VALIDATING_SOURCE',
  });

  var validate = validations[language];
  validate(source).then(function(errors) {
    dispatch({
      type: 'VALIDATED_SOURCE',
      payload: {errors: errors},
    });
  });
}

function validateAllSources(dispatch, project) {
  project.get('sources').forEach(function(source, language) {
    validateSource(dispatch, language, source);
  });
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

          validateAllSources(dispatch, getCurrentProject(getState()));
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

    Storage.save(getCurrentProject(getState()).toJS());

    validateSource(dispatch, language, newValue);
  };
};

exports.changeCurrentProject = function(projectKey) {
  return function(dispatch, getState) {
    dispatch({
      type: 'CURRENT_PROJECT_CHANGED',
      payload: {projectKey: projectKey},
    });

    Storage.setCurrentProjectKey(projectKey);

    validateAllSources(dispatch, getCurrentProject(getState()));
  };
};
