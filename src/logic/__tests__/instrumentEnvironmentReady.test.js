import mixpanel from 'mixpanel-browser';

import {editorReady} from '../../actions/instrumentation';
import {makeInstrumentEnvironmentReady} from '../instrumentEnvironmentReady';

import {makeTestLogic} from './helpers';

test('dispatches to mixpanel on the first editor ready action', async () => {
  const testLogic = makeTestLogic(makeInstrumentEnvironmentReady());
  const timestamp = 12345;
  await testLogic(editorReady('html', timestamp));
  expect(mixpanel.track).toHaveBeenCalledWith('Environment Ready', {
    Timestamp: timestamp,
  });
});

test('does not send additional events to mixpanel', async () => {
  const testLogic = makeTestLogic(makeInstrumentEnvironmentReady());
  await testLogic(editorReady('html', 0));
  mixpanel.track.mockClear();
  await testLogic(editorReady('css', 0));
  expect(mixpanel.track).not.toHaveBeenCalled();
});
