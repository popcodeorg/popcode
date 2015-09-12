var localforage = require('localforage');
var _ = require('lodash');

var storageVersion = 2;

var fullKeyFor = function(key) {
  return 'workspaces/' + key;
};

var find = function(key) {
  return localforage.getItem(fullKeyFor(key)).then(function(payload) {
    if (payload !== null) {
      return payload;
    }
  });
};

var Storage = {
  getCurrentProjectKey: function() {
    return localforage.getItem('currentProjectKey');
  },

  load: function() {
    return localforage.getItem('lastKey').then(function(key) {
      if (key !== null) {
        return find(key);
      }
    });
  },

  all: function() {
    return localforage.getItem('allKeys').then(function(keys) {
      return Promise.all(keys.map(find));
    });
  },

  save: function(key, data) {
    localforage.setItem('lastKey', key);
    localforage.getItem('allKeys').then(function(oldKeys) {
      if (oldKeys === null || oldKeys[oldKeys.length - 1] !== key) {
        var keys = _.without(oldKeys || [], key);
        keys.unshift(key);
        localforage.setItem('allKeys', keys);
      }
    });

    localforage.setItem(
      fullKeyFor(key),
      {
        key: key,
        storageVersion: storageVersion,
        updatedAt: new Date(),
        data: data
      }
    );

    return data;
  }
};

module.exports = Storage;
