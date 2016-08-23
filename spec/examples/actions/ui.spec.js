/* eslint-env mocha */

import '../../helper';
import {assert} from 'chai';
import {useFakeTimers} from 'sinon';
import createApplicationStore from '../../../src/createApplicationStore';
import waitFor from '../../helpers/waitFor';

import {TYPING_DEBOUNCE_DELAY, userTyped} from '../../../src/actions/ui';

const timeInterval = 1000 * 60 * 60 * 24;

describe('interfaceStateActions', () => {
  let store, clock;

  beforeEach(() => {
    store = createApplicationStore();
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.tick(timeInterval);
    clock.restore();
  });

  describe('userTyped', () => {
    beforeEach(() => store.dispatch(userTyped()));

    it('sets typing state to true', () => {
      assert.isTrue(store.getState().ui.getIn(['editors', 'typing']));
    });

    it('keeps typing state true before timeout expires', () =>
      assert.eventually.isTrue(
        waitFor(TYPING_DEBOUNCE_DELAY / 2, clock).
          then(() => store.getState().ui.getIn(['editors', 'typing']))
      )
    );

    it('sets typing state to false after timeout expires', () =>
      assert.eventually.isFalse(
        waitFor(TYPING_DEBOUNCE_DELAY, clock).
          then(() => store.getState().ui.getIn(['editors', 'typing']))
      )
    );

    it('keeps typing state true if there are additional keystrokes', () =>
      assert.eventually.isTrue(
        waitFor(TYPING_DEBOUNCE_DELAY * 0.8, clock).then(() => {
          store.dispatch(userTyped());
          return waitFor(TYPING_DEBOUNCE_DELAY * 0.9, clock).then(() =>
            store.getState().ui.getIn(['editors', 'typing'])
          );
        })
      )
    );
  });
});
