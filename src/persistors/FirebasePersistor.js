import values from 'lodash/values';
import {database} from '../services/appFirebase';

export default class FirebasePersistor {
  constructor(uid) {
    this.firebase = database.ref(`workspaces/${uid}`);
  }

  static forUser(user) {
    if (user.get('authenticated')) {
      return new this(user.get('id'));
    }
    return null;
  }

  async getCurrentProjectKey() {
    const snapshot =
      await this.firebase.child('currentProjectKey').once('value');
    return snapshot.val();
  }

  setCurrentProjectKey(projectKey) {
    return this.firebase.child('currentProjectKey').set(projectKey);
  }

  async all() {
    const projects = await this.firebase.child('projects').once('value');
    return values(projects.val() || {});
  }

  async load(projectKey) {
    const snapshot =
      await this.firebase.child('projects').child(projectKey).once('value');
    return snapshot.val();
  }

  async loadCurrentProject() {
    const projectKey = await this.getCurrentProjectKey();
    if (projectKey) {
      return this.load(projectKey);
    }
    return null;
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
