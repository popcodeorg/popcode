import isNil from 'lodash-es/isNil';
import {Factory} from 'rosie';

export const githubProfileFactory = new Factory().attrs({
  login: 'popcoder',
  id: 123456,
  node_id: 'ABC123',
  avatar_url: null,
  gravatar_id: null,
  url: 'https://api.github.com/users/popcoder',
  html_url: 'https://github.com/popcoder',
  followers_url: 'https://api.github.com/users/popcoder/followers',
  following_url: 'https://api.github.com/users/popcoder/following{/other_user}',
  gists_url: 'https://api.github.com/users/popcoder/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/popcoder/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/popcoder/subscriptions',
  organizations_url: 'https://api.github.com/users/popcoder/orgs',
  repos_url: 'https://api.github.com/users/popcoder/repos',
  events_url: 'https://api.github.com/users/popcoder/events{/privacy}',
  received_events_url: 'https://api.github.com/users/popcoder/received_events',
  type: 'User',
  site_admin: false,
  name: 'Popcoder',
  company: null,
  blog: '',
  location: null,
  email: null,
  hireable: null,
  bio: null,
  public_repos: 0,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '2014-09-12T15:02:43Z',
  updated_at: '2019-05-02T13:50:32Z',
  private_gists: 0,
  total_private_repos: 0,
  owned_private_repos: 0,
  disk_usage: 0,
  collaborators: 0,
  two_factor_authentication: false,
  plan: {
    name: 'free',
    space: 1234567,
    collaborators: 0,
    private_repos: 10000,
  },
});

export const githubGistFactory = new Factory()
  .option('html', undefined)
  .option('css', undefined)
  .option('javascript', undefined)
  .option('enabledLibraries', undefined)
  .option('hiddenUIComponents', undefined)
  .attr(
    'files',
    ['html', 'css', 'javascript', 'enabledLibraries', 'hiddenUIComponents'],
    (html, css, javascript, enabledLibraries, hiddenUIComponents) => {
      const files = [];
      if (!isNil(html)) {
        files.push({language: 'HTML', filename: 'index.html', content: html});
      }
      if (!isNil(css)) {
        files.push({language: 'CSS', filename: 'styles.css', content: css});
      }
      if (!isNil(javascript)) {
        files.push({
          language: 'JavaScript',
          filename: 'script.js',
          content: javascript,
        });
      }
      if (enabledLibraries || hiddenUIComponents) {
        files.push({
          language: 'JSON',
          filename: 'popcode.json',
          content: JSON.stringify({enabledLibraries, hiddenUIComponents}),
        });
      }
      return files;
    },
  );
