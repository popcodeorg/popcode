import values from 'lodash/values';
import {database} from '../services/appFirebase';

class FirebasePersistor {
  constructor(uid) {
    this.firebase = database.ref(`workspaces/${uid}`);
  }

  getCurrentProjectKey() {
    return this.firebase.child('currentProjectKey').once('value').
      then(snapshot => snapshot.val());
  }

  setCurrentProjectKey(projectKey) {
    return this.firebase.child('currentProjectKey').set(projectKey);
  }

  all() {
    return this.firebase.child('projects').once('value').
      then(projects => values(projects.val() || {}));
  }

  load(projectKey) {
    return this.firebase.child('projects').child(projectKey).once('value').
      then(snapshot => snapshot.val());
  }

  loadCurrentProject() {
    return this.getCurrentProjectKey().then((projectKey) => {
      if (projectKey) {
        return this.load(projectKey);
      }
      return null;
    });
  }

  save(project) {
    return this.firebase.child('projects').child(project.projectKey).
      setWithPriority(project, -Date.now());
  }

  saveCurrentProject(project) {
    return Promise.all([
      this.save(project),
      this.setCurrentProjectKey(project.projectKey),
    ]);
  }
}

export default FirebasePersistor;
