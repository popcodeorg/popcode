import constant from 'lodash-es/constant';

class AuthProvider {
  addScope() {}
}

export const auth = Object.assign(() => ({}), {
  GithubAuthProvider: AuthProvider,
  GoogleAuthProvider: AuthProvider,
});

export const initializeApp = constant({});
