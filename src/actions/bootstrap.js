import get from 'lodash/get';
import appFirebase from '../services/appFirebase';
import Gists from '../services/Gists';
import Bugsnag from '../util/Bugsnag';
import FirebasePersistor from '../persistors/FirebasePersistor';
import {
  createProject,
  initializeCurrentProjectFromGist,
  loadCurrentProject,
} from './projects';
import {loadAllProjects} from '.';
import {userAuthenticated} from './user';
import {notificationTriggered} from './ui';

export default function bootstrap(gistId) {
  return (dispatch) => {
    const promisedProjectFromStorage =
      getCurrentUserState().then(({user, project}) => {
        if (user) {
          dispatch(userAuthenticated(user));
          dispatch(loadAllProjects());
        }

        return project;
      });

    const promisedGist = retrieveGist(gistId).catch((error) => {
      dispatch(notificationTriggered(error, 'error', {gistId}));
      return null;
    });

    Promise.all([promisedProjectFromStorage, promisedGist]).
      then(([project, gist]) => {
        if (gist) {
          dispatch(initializeCurrentProjectFromGist(gist));
        } else if (project) {
          dispatch(loadCurrentProject(project));
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

function getCurrentUserState() {
  return oneAuth().then((authData) => {
    if (authData === null) {
      return {user: null, project: null};
    }

    return new FirebasePersistor(authData.auth.uid).loadCurrentProject().
      then((project) => ({user: authData, project}));
  });
}

function oneAuth() {
  return new Promise((resolve) => {
    function handleAuth(authData) {
      resolve(authData);
      appFirebase.offAuth(handleAuth);
    }
    appFirebase.onAuth(handleAuth);
  });
}
