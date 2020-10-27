import {fromJS} from 'immutable';
import React from 'react';
import {Provider} from 'react-redux';
import {act, create} from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import {MenuItem} from '../TopBar/createMenu';
import HamburgerMenu from '../TopBar/HamburgerMenu';

jest.mock('i18next', () => {
  return {
    t: jest.fn().mockImplementation(translationKey => translationKey),
    init: jest.fn(),
  };
});

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
    DEFAULT_PROPS.onAutoFormat.mockClear();
    DEFAULT_PROPS.onStartEditingInstructions.mockClear();
    DEFAULT_PROPS.onStartGithubLogIn.mockClear();
  });

  it('renders the format code button', () => {
    const menuItems = menu.root.findAllByType(MenuItem);
    const formatCodeBtn = menuItems.find(
      btn => btn.props.children === 'top-bar.format-code',
    );
    expect(formatCodeBtn).toBeTruthy();
  });

  it('calls the passed `onAutoFormat()` method when format code button is pressed', () => {
    const menuItems = menu.root.findAllByType(MenuItem);
    const formatCodeBtn = menuItems.find(
      btn => btn.props.children === 'top-bar.format-code',
    );

    act(() => {
      formatCodeBtn.props.onClick();
    });

    expect(DEFAULT_PROPS.onAutoFormat).toHaveBeenCalledTimes(1);
  });
});
