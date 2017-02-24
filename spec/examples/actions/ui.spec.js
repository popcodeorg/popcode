/* eslint-env mocha */
/* global sinon */

import '../../helper';
import {assert} from 'chai';
import createApplicationStore from '../../../src/createApplicationStore';
import waitFor from '../../helpers/waitFor';

import {TYPING_DEBOUNCE_DELAY} from '../../../src/actions/ui';

import {
  editorFocusedRequestedLine,
  userTyped,
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

  describe('userTyped', () => {
    beforeEach(() => store.dispatch(userTyped()));

    it('sets typing state to true', () => {
      assert.isTrue(store.getState().getIn(['ui', 'editors', 'typing']));
    });

    it('keeps typing state true before timeout expires', async () => {
      await waitFor(TYPING_DEBOUNCE_DELAY / 2, clock);
      assert.isTrue(store.getState().getIn(['ui', 'editors', 'typing']));
    });

    it('sets typing state to false after timeout expires', async () => {
      await waitFor(TYPING_DEBOUNCE_DELAY, clock);
      assert.isFalse(store.getState().getIn(['ui', 'editors', 'typing']));
    });

    it(
      'keeps typing state true if there are additional keystrokes',
      async () => {
        await waitFor(TYPING_DEBOUNCE_DELAY * 0.8, clock);
        store.dispatch(userTyped());
        await waitFor(TYPING_DEBOUNCE_DELAY * 0.9, clock);
        assert.isTrue(store.getState().getIn(['ui', 'editors', 'typing']));
      },
    );
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
