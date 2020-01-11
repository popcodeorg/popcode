import mixpanel from 'mixpanel-browser';

import {applicationLoaded} from '../../actions';
import instrumentApplicationLoaded from '../instrumentApplicationLoaded';

import {makeTestLogic} from './helpers';

const testLogic = makeTestLogic(instrumentApplicationLoaded);

it('should register no experimental mode', async () => {
  await testLogic(applicationLoaded());
  expect(mixpanel.register).toHaveBeenCalledWith({'Experimental Mode': false});
});

it('should register experimental mode', async () => {
  await testLogic(applicationLoaded({isExperimental: true}));
  expect(mixpanel.register).toHaveBeenCalledWith({'Experimental Mode': true});
});
