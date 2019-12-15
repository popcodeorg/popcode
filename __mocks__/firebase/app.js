import constant from 'lodash-es/constant';

export {default as performance, default as analytics} from 'lodash-es/noop';

class AuthProvider {
  addScope() {}
}

export const auth = Object.assign(() => ({}), {
  GithubAuthProvider: AuthProvider,
  GoogleAuthProvider: AuthProvider,
});

export const initializeApp = constant({});
