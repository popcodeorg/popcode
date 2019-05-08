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

export const firebaseErrorFactory = Factory.define(
  'firebaseError',
  FirebaseError,
).attrs({
  name: 'some other error',
});

export const credentialInUseErrorFactory = new Factory().extend(
  firebaseErrorFactory,
).attrs({
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

export const userFactory = new Factory().extend(
  userProviderDataFactory,
).attrs({
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: Date.now(),
    lastSignInTime: Date.now(),
  },
  providerData: () => [userProviderDataFactory.build()],
  refreshToken: 'token123',
});
