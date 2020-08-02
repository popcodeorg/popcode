import Immutable from 'immutable';
import partial from 'lodash-es/partial';

import {
  projectRestoredFromLastSession,
  snapshotImported,
} from '../../actions/clients';
import {
  changeCurrentProject,
  gistImported,
  projectCreated,
} from '../../actions/projects';
import reducer from '../currentProject';

import {deprecated_reducerTest as reducerTest} from './migratedKarmaTestHelpers';

import {githubGistFactory} from '@factories/clients/github';

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
    partial(
      gistImported,
      projectKey,
      githubGistFactory.build({}, {html: '<!doctype html>'}),
    ),
    Immutable.fromJS({projectKey}),
  ),
);
