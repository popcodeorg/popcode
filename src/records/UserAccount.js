import {Map, Record} from 'immutable';

export default Record(
  {
    id: null,
    displayName: null,
    avatarUrl: null,
    identityProviders: new Map(),
  },
  'UserAccount',
);
