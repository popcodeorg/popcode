import {Factory} from 'rosie';

class FirebaseError extends Error {
  constructor(args) {
    super(args.name);
    this.code = args.name;
    this.credential = args.credential;
    Error.captureStackTrace(this, FirebaseError);
  }
}

export const credentialFactory = new Factory()
  .attr('providerId', 'github.com')
  .attr('accessToken', ['providerId'], providerId =>
    providerId === 'github.com' ? 'abc123' : undefined,
  )
  .attr('idToken', ['providerId'], providerId =>
    providerId === 'google.com' ? 'abc123' : undefined,
  );

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

export const userFactory = new Factory()
  .extend(userProviderDataFactory)
  .attrs({
    emailVerified: false,
    isAnonymous: false,
    metadata: {
      creationTime: Date.now(),
      lastSignInTime: Date.now(),
    },
    refreshToken: 'token123',
  })
  .attr('providerData', ['providerId'], providerId => [
    userProviderDataFactory.build({providerId}),
  ]);
