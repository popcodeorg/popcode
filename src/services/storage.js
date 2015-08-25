var localforage = require('localforage');

var storageVersion = 2;

var fullKeyFor = function(key) {
  return 'workspaces/' + key;
};

var Storage = {
  load: function() {
    return localforage.getItem('lastKey').then(function(key) {
      if (key !== null) {
        return localforage.getItem(fullKeyFor(key)).then(function(payload) {
          if (payload !== null) {
            return payload;
          }
        });
      }
    });
  },

  save: function(key, data) {
    localforage.setItem('lastKey', key);
    localforage.setItem(
      fullKeyFor(key),
      {
        key: key,
        storageVersion: storageVersion,
        data: data
      }
    );

    return data;
  }
};

module.exports = Storage;
