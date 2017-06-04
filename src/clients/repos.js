import trim from 'lodash/trim';
import gitHub from '../services/gitHub';
import generatePreview from '../util/generatePreview';
import performWithRetries from '../util/performWithRetries';

const COMMIT_MESSAGE = 'Created using Popcode: https://popcode.org';
const MASTER_BRANCH = 'master';

// Sometimes there are race conditions with creating multiple files in separate
// API requests
function repoPerformWithRetries(perform) {
  return performWithRetries(perform, ['Not Found']);
}

async function createHtmlFile(github, project, userName, repoName) {
  if (trim(project.sources.html)) {
    return github.getRepo(userName, repoName).
      writeFile(
        MASTER_BRANCH,
        'raw_index.html',
        project.sources.html,
        COMMIT_MESSAGE,
        {},
      );
  }
  return Promise.resolve();
}

async function createCssFile(github, project, userName, repoName) {
  if (trim(project.sources.css)) {
    return github.getRepo(userName, repoName).
      writeFile(
        MASTER_BRANCH,
        'styles.css',
        project.sources.css,
        COMMIT_MESSAGE,
        {},
      );
  }
  return Promise.resolve();
}

async function createJsFile(github, project, userName, repoName) {
  if (trim(project.sources.javascript)) {
    return github.getRepo(userName, repoName).writeFile(
      MASTER_BRANCH, 'script.js', project.sources.js, COMMIT_MESSAGE, {});
  }
  return Promise.resolve();
}

async function createPreviewFile(github, project, userName, repoName) {
  if (trim(project.sources.html) ||
    trim(project.sources.css) ||
    trim(project.sources.javascript)) {
    const preview = generatePreview(
      project,
      {
        targetBaseTop: false,
        propagateErrorsToParent: false,
        breakLoops: false,
        nonBlockingAlertsAndPrompts: false,
      },
    );
    return github.getRepo(userName, repoName).
      writeFile(MASTER_BRANCH, 'index.html', preview, COMMIT_MESSAGE, {});
  }
  return Promise.resolve();
}

async function createFiles(github, project, userName, repoName) {
  await repoPerformWithRetries(
    () => createHtmlFile(github, project, userName, repoName),
  );
  await repoPerformWithRetries(
    () => createCssFile(github, project, userName, repoName),
  );
  await repoPerformWithRetries(
    () => createJsFile(github, project, userName, repoName),
  );
  await repoPerformWithRetries(
    () => createPreviewFile(github, project, userName, repoName),
  );
}

async function createBranch(github, userName, repoName, oldBranch, newBranch) {
  return github.getRepo(userName, repoName).
    createBranch(oldBranch, newBranch);
}

async function updateRepoDescription(github, userName, repoName) {
  const url = `https://${userName}.github.io/${repoName}`;
  return github.getRepo(userName, repoName).
    updateRepository({
      name: repoName,
      description: url,
      homepage: url,
    });
}

export async function createRepoFromProject(project, user) {
  const github = gitHub.clientForUser(user);
  const REPO_NAME = `popcode-repo-${Date.now()}`;

  const response =
    await repoPerformWithRetries(
      () => github.getUser().createRepo({name: REPO_NAME}),
    );

  const userName = response.data.owner.login;

  await createFiles(github, project, userName, REPO_NAME);
  await repoPerformWithRetries(
    () => createBranch(github, userName, REPO_NAME, MASTER_BRANCH, 'gh-pages'),
  );

  // we don't know the github username at time of repo creation so update here
  await repoPerformWithRetries(
    () => updateRepoDescription(github, userName, REPO_NAME),
  );

  return response.data;
}
