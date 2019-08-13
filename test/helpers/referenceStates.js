import {List, Map, fromJS} from 'immutable';

import {
  Course,
  Error,
  ErrorList,
  ErrorReport,
  GoogleClassroom,
  User,
  RemoteCollection,
} from '../../src/records';

const sampleError = new Error({reason: 'bad-code'});
const validatingErrorList = new ErrorList({state: 'validating'});

export const user = {
  initial: new User(),
};

export const projects = {
  initial: new Map(),
};

export const errors = {
  noErrors: new ErrorReport(),

  errors: new ErrorReport().set(
    'css',
    new ErrorList({items: new List([sampleError]), state: 'validation-error'}),
  ),

  validating: new ErrorReport({
    html: validatingErrorList,
    css: validatingErrorList,
    javascript: validatingErrorList,
  }),
};

export const clients = {
  initial: fromJS({
    firebase: {exportingSnapshot: false},
    projectExports: {},
  }),
  waitingForSnapshot: fromJS({
    firebase: {exportingSnapshot: true},
    projectExports: {},
  }),
  waitingForGist: fromJS({
    firebase: {exportingSnapshot: false},
    projectExports: {gist: {status: 'waiting'}},
  }),
};

export const googleClassroom = {
  initial: new GoogleClassroom({
    courses: new RemoteCollection({
      items: new Map(),
      isFullyLoaded: false,
    }),
  }),
  withCourses: new GoogleClassroom({
    courses: new RemoteCollection({
      items: new Map({
        10800902048: new Course({
          alternateLink: 'http://classroom.google.com/c/MTA4MDA5MDIwNDha',
          courseState: 'ACTIVE',
          creationTime: '2018-01-22T22:16:25.726Z',
          descriptionHeading: '2018-2019 Program Manager Tech Training',
          guardiansEnabled: true,
          id: '10800902048',
          name: '2018-2019 Sample Class',
          updateTime: '2018-10-01T18:11:58.432Z',
        }),
      }),
      isFullyLoaded: false,
    }),
  }),
  withCoursesAndFullyLoaded: new GoogleClassroom({
    courses: new RemoteCollection({
      items: new Map({
        10800902048: new Course({
          alternateLink: 'http://classroom.google.com/c/MTA4MDA5MDIwNDha',
          courseState: 'ACTIVE',
          creationTime: '2018-01-22T22:16:25.726Z',
          descriptionHeading: '2018-2019 Program Manager Tech Training',
          guardiansEnabled: true,
          id: '10800902048',
          name: '2018-2019 Sample Class',
          updateTime: '2018-10-01T18:11:58.432Z',
        }),
      }),
      isFullyLoaded: true,
    }),
  }),
};
