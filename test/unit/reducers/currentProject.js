import Immutable from 'immutable';
import partial from 'lodash-es/partial';
import test from 'tape-catch';

import {
  projectRestoredFromLastSession,
  snapshotImported,
} from '../../../src/actions/clients';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
} from '../../../src/actions/projects';
import reducer from '../../../src/reducers/currentProject';
import {gistData} from '../../helpers/factory';
import reducerTest from '../../helpers/reducerTest';

const projectKey = '12345';
const initialState = reducer(undefined, {type: null});

test(
  'projectCreated',
  reducerTest(
    reducer,
    initialState,
    partial(projectCreated, projectKey),
    new Immutable.Map().set('projectKey', projectKey),
    'sets projectKey to key from payload',
  ),
);

test(
  'changeCurrentProject',
  reducerTest(
    reducer,
    initialState,
    partial(changeCurrentProject, projectKey),
    new Immutable.Map().set('projectKey', projectKey),
    'sets projectKey to current project key',
  ),
);

test(
  'snapshotImported',
  reducerTest(
    reducer,
    initialState,
    partial(snapshotImported, projectKey, {}),
    Immutable.fromJS({projectKey}),
  ),
);

test(
  'projectRestoredFromLastSession',
  reducerTest(
    reducer,
    initialState,
    partial(projectRestoredFromLastSession, {projectKey}),
    Immutable.fromJS({projectKey}),
  ),
);

test(
  'gistImported',
  reducerTest(
    reducer,
    initialState,
    partial(gistImported, projectKey, gistData({html: '<!doctype html>'})),
    Immutable.fromJS({projectKey}),
  ),
);
