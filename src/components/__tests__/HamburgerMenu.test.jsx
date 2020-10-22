import i18next from 'i18next';
import {fromJS} from 'immutable';
import constant from 'lodash-es/constant';
import React from 'react';
import {Provider} from 'react-redux';
import {act, create} from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import {MenuItem} from '../TopBar/createMenu';
import HamburgerMenu from '../TopBar/HamburgerMenu';

jest.mock('i18next', () => {
  return {
    t: jest.fn(),
    init: jest.fn(),
  };
});

i18next.t.mockImplementation(constant('MOCKED_TRANSLATION_STRING'));

const mockStore = configureStore([]);
const store = mockStore(
  fromJS({
    ui: {
      openTopBarMenu: 'hamburger',
    },
  }),
);

const DEFAULT_PROPS = {
  hasInstructions: false,
  isEditingInstructions: false,
  isUserAuthenticated: false,
  onAutoFormat: jest.fn(),
  onStartEditingInstructions: jest.fn(),
  onStartGithubLogIn: jest.fn(),
};

function buildComponent() {
  return (
    <Provider store={store}>
      <HamburgerMenu {...DEFAULT_PROPS} />
    </Provider>
  );
}

function renderComponent(props = {}) {
  let component;
  act(() => {
    component = create(buildComponent(props));
  });
  return component;
}

describe('hamburger menu', () => {
  let menu;

  beforeEach(() => {
    menu = renderComponent();
  });

  it('calls the passed `onAutoFormat()` method when format code button is pressed', () => {
    const firstMenuItem = menu.root.findAllByType(MenuItem)[0];

    act(() => {
      firstMenuItem.props.onClick();
    });

    expect(DEFAULT_PROPS.onAutoFormat).toHaveBeenCalledTimes(1);
  });
});
