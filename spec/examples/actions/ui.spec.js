/* eslint-env mocha */
/* global sinon */

import '../../helper';
import {assert} from 'chai';
import createApplicationStore from '../../../src/createApplicationStore';

import {
  notificationTriggered,
  userDismissedNotification,
} from '../../../src/actions';

const timeInterval = 1000 * 60 * 60 * 24;

describe('interfaceStateActions', () => {
  let store, clock;

  beforeEach(() => {
    store = createApplicationStore();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.tick(timeInterval);
    clock.restore();
  });

  describe('notificationTriggered', () => {
    it('sets notifications to given type and severity', () => {
      store.dispatch(notificationTriggered('some-error', 'error'));

      assert.include(
        store.getState().getIn(['ui', 'notifications']).toJSON(),
        {type: 'some-error', severity: 'error', payload: {}},
      );
    });
  });

  describe('notificationTriggered', () => {
    it('sets notifications to given type, severity, and payload', () => {
      store.dispatch(
        notificationTriggered('some-error', 'error', {spooky: true}),
      );

      assert.include(
        store.getState().getIn(['ui', 'notifications']).toJSON(),
        {type: 'some-error', severity: 'error', payload: {spooky: true}},
      );
    });
  });

  describe('userDismissedNotification', () => {
    beforeEach(() => {
      store.dispatch(notificationTriggered('some-error', 'error'));
      store.dispatch(userDismissedNotification('some-error'));
    });

    it('removes notifications of given type', () => {
      assert.notInclude(
        store.getState().getIn(['ui', 'notifications']).map(
          notification => notification.get('type'),
        ),
        'some-error',
      );
    });
  });
});
