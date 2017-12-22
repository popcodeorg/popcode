import get from 'lodash/get';
import GitHub from 'github-api';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import performWithRetries from '../util/performWithRetries';
import compileProject from '../util/compileProject';

const anonymousGithub = new GitHub({});
const COMMIT_MESSAGE = 'Created using Popcode: https://popcode.org';
const MASTER = 'master';
const GH_PAGES = 'gh-pages';
const NETWORK_ERROR = 'Network Error';

export function EmptyGistError(message) {
  this.name = 'EmptyGistError';
  this.message = message;
  this.stack = new Error().stack;
}
EmptyGistError.prototype = Object.create(Error.prototype);

function normalizeTitle(title) {
  const titleWithoutPunctuationAndWhitespace = title.
    replace(/[^\w\s]|_/g, '').
    replace(/\W/g, '-');

  return titleWithoutPunctuationAndWhitespace;
}

export async function createRepoFromProject(project, user) {
  const github = clientForUser(user);
  const preview = await compileProject(project);
  const title = normalizeTitle(preview.title);

  const REPO_NAME = `${title}-${Date.now()}`;

  const {data} =
    await performWithRetryNetworkErrors(
      () => github.getUser().createRepo({name: REPO_NAME, auto_init: true}),
    );

  const userName = data.owner.login;

  await performWithRetryNetworkErrors(
    () => github.getRepo(userName, REPO_NAME).deleteFile(MASTER, 'README.md'),
  );

  await createBranch(github, userName, REPO_NAME, MASTER, GH_PAGES);

  await createHtmlFile(github, project, userName, REPO_NAME);

  await createCssFile(github, project, userName, REPO_NAME);

  await createJsFile(github, project, userName, REPO_NAME);

  await createPreviewFile(github, project, userName, REPO_NAME);

  await updateRepoDescription(github, userName, REPO_NAME);

  return data;
}

export async function createGistFromProject(project, user) {
  const github = clientForUser(user);

  const gist = buildGistFromProject(project);
  if (isEmpty(gist.files)) {
    return Promise.reject(new EmptyGistError());
  }

  const response =
    await performWithRetryNetworkErrors(() => github.getGist().create(gist));

  const gistData = response.data;
  if (canUpdateGist(user)) {
    return updateGistWithImportUrl(github, gistData);
  }
  return gistData;
}

export async function loadGistFromId(gistId, user) {
  const github = clientForUser(user);
  const gist = github.getGist(gistId);
  const response =
    await performWithRetryNetworkErrors(() => gist.read(), {retries: 3});
  return response.data;
}

function buildGistFromProject(project) {
  const files = {};
  if (trim(project.sources.html)) {
    files['index.html'] = {
      content: project.sources.html,
      language: 'HTML',
    };
  }
  if (trim(project.sources.css)) {
    files['styles.css'] = {
      content: project.sources.css,
      language: 'CSS',
    };
  }
  if (trim(project.sources.javascript)) {
    files['script.js'] = {
      content: project.sources.javascript,
      language: 'JavaScript',
    };
  }
  if (trim(project.instructions)) {
    files['README.md'] = {
      content: project.instructions,
      language: 'Markdown',
    };
  }
  if (project.enabledLibraries.length || project.hiddenUIComponents.length) {
    files['popcode.json'] = {
      content: createPopcodeJson(project),
      language: 'JSON',
    };
  }

  return {
    description: 'Exported from Popcode.',
    'public': true,
    files,
  };
}

async function updateGistWithImportUrl(github, gistData) {
  const gist = github.getGist(gistData.id);
  const uri = document.createElement('a');
  uri.setAttribute('href', '/');
  uri.search = `gist=${gistData.id}`;

  const description = `${gistData.description} Click to import: ${uri.href}`;
  const response =
    await performWithRetryNetworkErrors(() => gist.update({description}));
  return response.data;
}

function createPopcodeJson(project) {
  const json = {};
  if (project.enabledLibraries.length) {
    json.enabledLibraries = project.enabledLibraries;
  }
  if (project.hiddenUIComponents.length) {
    json.hiddenUIComponents = project.hiddenUIComponents;
  }
  return JSON.stringify(json);
}

function performWithRetryNetworkErrors(perform, options = {}) {
  return performWithRetries(
    perform,
    errorMessage => errorMessage === NETWORK_ERROR,
    options,
  );
}

async function createSourceFileInRepo(
  github,
  userName,
  repoName,
  branchName,
  fileName,
  source,
) {
  await performWithRetryNetworkErrors(() => github.getRepo(userName, repoName).
    writeFile(
      branchName,
      fileName,
      source,
      COMMIT_MESSAGE,
      {},
    ),
  );
}

async function createHtmlFile(github, project, userName, repoName) {
  if (trim(project.sources.html)) {
    await createSourceFileInRepo(
      github,
      userName,
      repoName,
      MASTER,
      'index.html',
      project.sources.html,
    );
  }
}

async function createCssFile(github, project, userName, repoName) {
  if (trim(project.sources.css)) {
    await createSourceFileInRepo(
      github,
      userName,
      repoName,
      MASTER,
      'styles.css',
      project.sources.css,
    );
  }
}

async function createJsFile(github, project, userName, repoName) {
  if (trim(project.sources.javascript)) {
    await createSourceFileInRepo(
      github,
      userName,
      repoName,
      MASTER,
      'script.js',
      project.sources.javascript,
    );
  }
}

async function createPreviewFile(github, project, userName, repoName) {
  const preview = await compileProject(project);
  await createSourceFileInRepo(
    github,
    userName,
    repoName,
    GH_PAGES,
    'index.html',
    preview.source,
  );
}

async function createBranch(
  github,
  userName,
  repoName,
  oldBranch,
  newBranch,
) {
  await performWithRetryNetworkErrors(() => github.getRepo(userName, repoName).
    createBranch(oldBranch, newBranch),
  );
}

async function updateRepoDescription(github, userName, repoName) {
  const url = `https://${userName}.github.io/${repoName}`;
  await performWithRetryNetworkErrors(() => github.getRepo(userName, repoName).
    updateRepository({
      name: repoName,
      description: url,
      homepage: url,
    }),
  );
}

function githubWithAccessToken(token) {
  return new GitHub({auth: 'oauth', token});
}

function getGithubToken(user) {
  return get(user, ['accessTokens', 'github.com']);
}

function clientForUser(user) {
  const githubToken = getGithubToken(user);
  if (githubToken) {
    return githubWithAccessToken(githubToken);
  }

  return anonymousGithub;
}

function canUpdateGist(user) {
  return Boolean(getGithubToken(user));
}
