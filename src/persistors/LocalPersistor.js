import localforage from 'localforage';
import assign from 'lodash/assign';
import without from 'lodash/without';

const storageVersion = 3;

function fullKeyFor(key) {
  return `workspaces/${storageVersion}/${key}`;
}

const LocalPersistor = {
  getCurrentProjectKey() {
    return localforage.getItem('currentProjectKey');
  },

  setCurrentProjectKey(projectKey) {
    return localforage.setItem('currentProjectKey', projectKey);
  },

  all() {
    return localforage.getItem('allKeys').then((keys) => {
      if (keys) {
        return Promise.all(keys.map(this.load));
      }

      return Promise.resolve([]);
    });
  },

  load(projectKey) {
    return localforage.getItem(fullKeyFor(projectKey)).then((payload) => {
      if (payload !== null) {
        return payload;
      }

      return null;
    });
  },

  save(data) {
    const key = data.projectKey;

    localforage.setItem(
      fullKeyFor(key),
      assign({
        storageVersion,
        updatedAt: new Date(),
      }, data)
    ).then(() => {
      localforage.getItem('allKeys').then((oldKeys) => {
        if (oldKeys === null || oldKeys[oldKeys.length - 1] !== key) {
          const keys = without(oldKeys || [], key);
          keys.unshift(key);
          localforage.setItem('allKeys', keys);
        }
      });
    });

    return data;
  },
};

export default LocalPersistor;
