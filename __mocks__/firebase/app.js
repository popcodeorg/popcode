import constant from 'lodash-es/constant';

export {default as performance} from 'lodash/noop';

class AuthProvider {
  addScope() {}
}

export const auth = Object.assign(() => ({}), {
  GithubAuthProvider: AuthProvider,
  GoogleAuthProvider: AuthProvider,
});

export const initializeApp = constant({});
