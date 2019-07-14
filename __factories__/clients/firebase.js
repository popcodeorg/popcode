import {Factory} from 'rosie';

class FirebaseError extends Error {
  constructor(args) {
    super(args.name);
    this.code = args.name;
    this.credential = args.credential;
    Error.captureStackTrace(this, FirebaseError);
  }
}

export const credentialFactory = new Factory().attrs({
  providerId: 'github.com',
  accessToken: 'abc123',
});

export const firebaseErrorFactory = Factory.define(
  'firebaseError',
  FirebaseError,
).attrs({
  name: 'some other error',
});

export const credentialInUseErrorFactory = new Factory()
  .extend(firebaseErrorFactory)
  .attrs({
    name: 'auth/credential-already-in-use',
    credential: () => credentialFactory.build(),
  });

export const userProviderDataFactory = new Factory().attrs({
  displayName: 'popcoder',
  email: null,
  phoneNumber: null,
  photoUrl: null,
  providerId: 'github.com',
  uid: '1234567',
});

export const userFactory = new Factory().extend(userProviderDataFactory).attrs({
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: Date.now(),
    lastSignInTime: Date.now(),
  },
  providerData: () => [userProviderDataFactory.build()],
  refreshToken: 'token123',
});
