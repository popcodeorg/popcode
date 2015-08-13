var localforage = require('localforage');

var storageVersion = 1;

var fullKeyFor = function(key) {
  return storageVersion + '/workspaces/' + key;
};

var Storage = {
  load: function() {
    return localforage.getItem('lastKey').then(function(key) {
      if (key !== null) {
        return localforage.getItem(fullKeyFor(key)).then(function(data) {
          if (data !== null) {
            return {key: key, data: data};
          }
        });
      }
    });
  },

  save: function(key, data) {
    localforage.setItem('lastKey', key)
    localforage.setItem(fullKeyFor(key), data)
    return data;
  }
};

module.exports = Storage;
