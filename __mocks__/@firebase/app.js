import constant from 'lodash-es/constant';

class AuthProvider {
  addScope() {}
}

export const firebase = {
  auth: Object.assign(() => ({}), {
    GithubAuthProvider: AuthProvider,
    GoogleAuthProvider: AuthProvider,
  }),

  initializeApp: constant({}),
};
