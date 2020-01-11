import findLast from 'lodash-es/findLast';
import get from 'lodash-es/get';
import mixpanel from 'mixpanel-browser';
import uuid from 'uuid/v4';

import {firebaseProjectFactory} from '../../../__factories__/data/firebase';
import {applicationLoaded} from '../../actions';
import {rehydrateProject} from '../../clients/localStorage';
import config from '../../config';
import createApplicationStore from '../../createApplicationStore';

import init from '..';
import i18next from 'i18next';

jest.mock('../../clients/localStorage');
jest.mock('../../clients/firebase');
jest.mock('../../createApplicationStore');

describe('init()', () => {
  let dispatch;
  let store;

  beforeEach(() => {
    dispatch = jest.fn();
    store = {dispatch};
    createApplicationStore.mockReturnValue(store);
  });

  test('initializes i18next', () => {
    init();
    expect(i18next.init).toHaveBeenCalledWith(expect.anything());
  });

  test('initializes mixpanel', async () => {
    init();
    await new Promise(resolve => {
      mixpanel.init.mockImplementation(resolve);
    });
    expect(mixpanel.init).toHaveBeenCalledWith(config.mixpanelToken);
  });

  describe('applicationLoaded', () => {
    let dispatchInvoked;

    beforeEach(() => {
      dispatchInvoked = new Promise(resolve => {
        dispatch.mockImplementation(resolve);
      });
    });

    async function dispatchedAction() {
      await dispatchInvoked;
      return get(
        findLast(
          dispatch.mock.calls,
          ([action]) => action.type === applicationLoaded.toString(),
        ),
        ['0'],
      );
    }

    test('dispatches action', async () => {
      init();

      const action = await dispatchedAction();
      expect(action).toBeDefined();
    });

    test('reads gist ID from query and removes it', async () => {
      history.pushState(null, '', '/?gist=12345');
      init();
      const {
        payload: {gistId},
      } = await dispatchedAction();
      expect(gistId).toBe('12345');
      expect(location.search).toBeFalsy();
    });

    test('reads snapshot key from query and removes it', async () => {
      const snapshotKey = uuid();
      history.pushState(null, '', `/?snapshot=${snapshotKey}`);
      init();
      const {payload} = await dispatchedAction();
      expect(payload.snapshotKey).toEqual(snapshotKey);
    });

    test('reads experimental mode from query and leaves it', async () => {
      history.pushState(null, '', '/?experimental');
      init();
      const {
        payload: {isExperimental},
      } = await dispatchedAction();
      expect(isExperimental).toBe(true);
      expect(location.search).toBe('?experimental');
    });

    test('rehydrates project', async () => {
      const project = firebaseProjectFactory.build();
      rehydrateProject.mockReturnValue(project);
      init();
      const {
        payload: {rehydratedProject},
      } = await dispatchedAction();
      expect(rehydratedProject).toBe(project);
    });
  });
});
