var localforage = require('localforage');
var lodash = require('lodash');

var storageVersion = 3;

var fullKeyFor = function(key) {
  return 'workspaces/' + storageVersion + '/' + key;
};

var Storage = {
  getCurrentProjectKey: function() {
    return localforage.getItem('currentProjectKey');
  },

  setCurrentProjectKey: function(projectKey) {
    localforage.setItem('currentProjectKey', projectKey);
  },

  all: function() {
    return localforage.getItem('allKeys').then(function(keys) {
      return Promise.all(keys.map(this.load));
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

    localforage.getItem('allKeys').then(function(oldKeys) {
      if (oldKeys === null || oldKeys[oldKeys.length - 1] !== key) {
        var keys = lodash.without(oldKeys || [], key);
        keys.unshift(key);
        localforage.setItem('allKeys', keys);
      }
    });

    localforage.setItem(
      fullKeyFor(key),
      lodash.extend({
        storageVersion: storageVersion,
        updatedAt: new Date()
      }, data)
    );

    return data;
  }
};

module.exports = Storage;
