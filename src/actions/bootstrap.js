import get from 'lodash/get';
import Gists from '../services/Gists';
import Bugsnag from '../util/Bugsnag';
import {getInitialUserState} from '../clients/firebaseAuth';
import {
  createProject,
  initializeCurrentProjectFromGist,
} from './projects';
import {userAuthenticated} from './user';
import {notificationTriggered} from './ui';
import {loadAllProjects} from '.';

export default function bootstrap(gistId) {
  return async (dispatch) => {
    const userStateResolved = getInitialUserState();

    const promisedGist = retrieveGist(gistId).catch((error) => {
      dispatch(notificationTriggered(error, 'error', {gistId}));
      return null;
    });

    const [gist, userCredential] =
      await Promise.all([promisedGist, userStateResolved]);

    if (userCredential) {
      dispatch(userAuthenticated(userCredential));
      dispatch(loadAllProjects());
    }

    if (gist) {
      dispatch(initializeCurrentProjectFromGist(gist));
    } else {
      dispatch(createProject());
    }
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
