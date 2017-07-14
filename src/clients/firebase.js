import values from 'lodash/values';
import {database} from '../services/appFirebase';

function workspace(uid) {
  return database.ref(`workspaces/${uid}`);
}

async function getCurrentProjectKey(uid) {
  const snapshot =
    await workspace(uid).child('currentProjectKey').once('value');
  return snapshot.val();
}

export async function setCurrentProjectKey(uid, projectKey) {
  await workspace(uid).child('currentProjectKey').set(projectKey);
}

export async function loadAllProjects(uid) {
  const projects = await workspace(uid).child('projects').once('value');
  return values(projects.val() || {});
}

async function loadProject(uid, projectKey) {
  const snapshot =
    await workspace(uid).child('projects').child(projectKey).once('value');
  return snapshot.val();
}

export async function loadCurrentProject(uid) {
  const projectKey = await getCurrentProjectKey(uid);
  if (projectKey) {
    return loadProject(uid, projectKey);
  }
  return null;
}

async function saveProject(uid, project) {
  await workspace(uid).child('projects').child(project.projectKey).
    setWithPriority(project, -Date.now());
}

export async function saveCurrentProject(uid, project) {
  return Promise.all([
    saveProject(uid, project),
    setCurrentProjectKey(uid, project.projectKey),
  ]);
}
