import get from 'lodash/get';
import appFirebase from '../services/appFirebase';
import Gists from '../services/Gists';
import Bugsnag from '../util/Bugsnag';
import {
  createProject,
  initializeCurrentProjectFromGist,
} from './projects';
import {loadAllProjects} from '.';
import {userAuthenticated} from './user';
import {notificationTriggered} from './ui';

export default function bootstrap(gistId) {
  return (dispatch) => {
    const userStateResolved = oneAuth().then((userData) => {
      if (userData) {
        dispatch(userAuthenticated({userData}));
        dispatch(loadAllProjects());
      }
    });

    const promisedGist = retrieveGist(gistId).catch((error) => {
      dispatch(notificationTriggered(error, 'error', {gistId}));
      return null;
    });

    Promise.all([promisedGist, userStateResolved]).then(([gist]) => {
      if (gist) {
        dispatch(initializeCurrentProjectFromGist(gist));
      } else {
        dispatch(createProject());
      }
    });
  };
}

function retrieveGist(gistId) {
  if (!gistId) {
    return Promise.resolve(null);
  }
  return Gists.
    loadFromId(gistId, {authenticated: false}).
    catch((error) => {
      if (get(error, 'response.status') === 404) {
        return Promise.reject('gist-import-not-found');
      }
      Bugsnag.notify(error);
      return Promise.reject('gist-import-error');
    });
}

function oneAuth() {
  return new Promise((resolve) => {
    function handleAuth(userData) {
      resolve(userData);
      appFirebase.offAuth(handleAuth);
    }
    appFirebase.onAuth(handleAuth);
  });
}
