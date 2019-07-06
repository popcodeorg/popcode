import {Record, Map} from 'immutable';

export default Record(
  {
    items: new Map(),
    isFullyLoaded: false,
  },
  'RemoteCollection',
);
