import values from 'lodash/values';
import appFirebase from '../services/appFirebase';

class FirebasePersistor {
  constructor(user) {
    this.user = user;
    this.firebase = appFirebase.child(`workspaces/${user.id}`);
  }

  getCurrentProjectKey() {
    return new Promise((resolve) => {
      this.firebase.child('currentProjectKey').once('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  setCurrentProjectKey(projectKey) {
    return new Promise((resolve, reject) => {
      this.firebase.child('currentProjectKey').set(projectKey, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  all() {
    return new Promise((resolve) => {
      this.firebase.child('projects').once('value', (projects) => {
        resolve(values(projects.val() || {}));
      });
    });
  }

  load(projectKey) {
    return new Promise((resolve) => {
      this.firebase.child('projects').child(projectKey).
        once('value', (snapshot) => {
          resolve(snapshot.val());
        });
    });
  }

  save(project) {
    return new Promise((resolve, reject) => {
      this.firebase.child('projects').child(project.projectKey).
        setWithPriority(project, -Date.now(), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
    });
  }

  saveCurrentProject(project) {
    return Promise.all([
      this.save(project),
      this.setCurrentProjectKey(project.projectKey),
    ]);
  }
}

export default FirebasePersistor;
