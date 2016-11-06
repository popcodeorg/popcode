import GitHub from 'github-api';

const anonymousGithub = new GitHub({});

export default {
  anonymous() {
    return anonymousGithub;
  },

  withAccessToken(token) {
    return new GitHub({auth: 'oauth', token});
  },
};
