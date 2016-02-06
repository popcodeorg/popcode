var localforage = require('localforage');
var assign = require('lodash/assign');
var without = require('lodash/without');

var storageVersion = 3;

function fullKeyFor(key) {
  return 'workspaces/' + storageVersion + '/' + key;
}

var Storage = {
  getCurrentProjectKey: function() {
    return localforage.getItem('currentProjectKey');
  },

  setCurrentProjectKey: function(projectKey) {
    localforage.setItem('currentProjectKey', projectKey);
  },

  all: function() {
    return localforage.getItem('allKeys').then(function(keys) {
      if (keys) {
        return Promise.all(keys.map(this.load));
      }

      return Promise.resolve([]);
    }.bind(this));
  },

  load: function(projectKey) {
    return localforage.getItem(fullKeyFor(projectKey)).then(function(payload) {
      if (payload !== null) {
        return payload;
      }
    });
  },

  save: function(data) {
    var key = data.projectKey;

    localforage.setItem(
      fullKeyFor(key),
      assign({
        storageVersion: storageVersion,
        updatedAt: new Date(),
      }, data)
    ).then(function() {
      localforage.getItem('allKeys').then(function(oldKeys) {
        if (oldKeys === null || oldKeys[oldKeys.length - 1] !== key) {
          var keys = without(oldKeys || [], key);
          keys.unshift(key);
          localforage.setItem('allKeys', keys);
        }
      });
    });

    return data;
  },
};

module.exports = Storage;
