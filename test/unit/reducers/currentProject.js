import test from 'tape';
import partial from 'lodash/partial';
import Immutable from 'immutable';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/currentProject';
import {
  changeCurrentProject,
  projectCreated,
  gistImported,
} from '../../../src/actions/projects';
import {gistData} from '../../helpers/factory';

const projectKey = '12345';
const initialState = reducer(undefined, {type: null});

test('projectCreated', reducerTest(
  reducer,
  initialState,
  partial(projectCreated, projectKey),
  new Immutable.Map().set('projectKey', projectKey),
  'sets projectKey to key from payload',
));

test('changeCurrentProject', reducerTest(
  reducer,
  initialState,
  partial(changeCurrentProject, projectKey),
  new Immutable.Map().set('projectKey', projectKey),
  'sets projectKey to current project key',
));

test('gistImported', reducerTest(
  reducer,
  initialState,
  partial(
    gistImported,
    projectKey,
    gistData({html: '<!doctype html>'}),
  ),
  Immutable.fromJS({projectKey}),
));
