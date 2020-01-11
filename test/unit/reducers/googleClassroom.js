import partial from 'lodash-es/partial';
import tap from 'lodash-es/tap';
import test from 'tape';

import {coursesFullyLoaded, coursesLoaded} from '../../../src/actions/ui';
import reducer from '../../../src/reducers/googleClassroom';
import {course} from '../../helpers/factory';
import reducerTest from '../../helpers/reducerTest';

import {googleClassroom as states} from '../../helpers/referenceStates';

test('snapshot export', t => {
  tap([course()], coursesIn => {
    t.test(
      'coursesLoaded',
      reducerTest(
        reducer,
        states.initial,
        partial(coursesLoaded, coursesIn),
        states.withCourses,
        'adds projects to remote collection',
      ),
    );
  });

  t.test(
    'coursesFulllyLoaded',
    reducerTest(
      reducer,
      states.withCourses,
      coursesFullyLoaded,
      states.withCoursesAndFullyLoaded,
      'sets isFullyLoaded to true',
    ),
  );
});
