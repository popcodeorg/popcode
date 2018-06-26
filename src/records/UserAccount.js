import {Map, Record} from 'immutable';

export default Record({
  id: null,
  displayName: null,
  avatarUrl: null,
  accessTokens: new Map(),
}, 'UserAccount');
