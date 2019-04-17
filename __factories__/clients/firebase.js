import {Factory} from 'rosie';

class FirebaseError extends Error {
  constructor(args) {
    super(args.name);
    this.code = args.name;
    this.credential = args.credential;
    Error.captureStackTrace(this, FirebaseError);
  }
}

export const credential = new Factory().attrs({
  providerId: 'github.com',
  accessToken: 'abc123',
});

export const githubProfile = new Factory().attrs({
  login: 'popcoder',
});

export const firebaseError = Factory.define(
  'firebaseError',
  FirebaseError,
).attrs({
  name: 'some other error',
});

export const credentialInUseError = new Factory().extend(firebaseError).attrs({
  name: 'auth/credential-already-in-use',
  credential: credential.build(),
});
