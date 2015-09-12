var AppDispatcher = require('../dispatcher/AppDispatcher');
var CurrentProjectConstants = require('../constants/CurrentProjectConstants');

var CurrentProjectActions = {
  setKeyFromStorage: function(projectKey) {
    AppDispatcher.dispatch({
      actionType: CurrentProjectConstants.CURRENT_PROJECT_KEY_LOADED,
      projectKey: projectKey
    });
  }
};

module.exports = CurrentProjectActions;
