/* eslint-env mocha */
/* global sinon */

import '../../helper';
import {assert} from 'chai';
import createApplicationStore from '../../../src/createApplicationStore';

import {
  editorFocusedRequestedLine,
  userRequestedFocusedLine,
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

  describe('userRequestedFocusedLine', () => {
    beforeEach(
      () => store.dispatch(userRequestedFocusedLine('javascript', 4, 2)),
    );

    it('sets requestedFocusedLine to given value', () => {
      assert.deepEqual(
        store.getState().getIn(
          ['ui', 'editors', 'requestedFocusedLine'],
        ).toJS(),
        {language: 'javascript', line: 4, column: 2},
      );
    });
  });

  describe('editorFocusedRequestedLine', () => {
    beforeEach(() => {
      store.dispatch(userRequestedFocusedLine('javascript', 4, 2));
      store.dispatch(editorFocusedRequestedLine());
    });

    it('sets requestedFocusedLine to null', () => {
      assert.isNull(
        store.getState().getIn(['ui', 'editors', 'requestedFocusedLine']),
      );
    });
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
