import get from 'lodash/get';
import GitHub from 'github-api';

const anonymousGithub = new GitHub({});

export default {
  anonymous() {
    return anonymousGithub;
  },

  withAccessToken(token) {
    return new GitHub({auth: 'oauth', token});
  },

  getGithubToken(user) {
    return get(user, ['accessTokens', 'github.com']);
  },

  clientForUser(user) {
    const githubToken = this.getGithubToken(user);
    if (githubToken) {
      return this.withAccessToken(githubToken);
    }

    return this.anonymous();
  },

  canUpdateGist(user) {
    return Boolean(this.getGithubToken(user));
  },
};
