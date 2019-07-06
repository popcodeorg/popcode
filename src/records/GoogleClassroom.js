import {Record} from 'immutable';

import RemoteColection from './RemoteCollection';

export default Record(
  {
    courses: new RemoteColection(),
  },
  'GoogleClassroom',
);
