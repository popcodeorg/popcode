import Immutable from 'immutable';

const defaultState = new Immutable.Map().
  set('editors', new Immutable.Map({typing: false})).
  set('minimizedComponents', new Immutable.Set()).
  set(
    'dashboard',
    new Immutable.Map().
      set('isOpen', false).
      set('activeSubmenu', null)
  );

function ui(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'USER_TYPING':
      return state.setIn(['editors', 'typing'], true);

    case 'USER_DONE_TYPING':
      return state.setIn(['editors', 'typing'], false);

    case 'DASHBOARD_TOGGLED':
      return state.updateIn(['dashboard', 'isOpen'], (isOpen) => !isOpen).
        setIn(['dashboard', 'activeSubmenu'], null);

    case 'DASHBOARD_SUBMENU_TOGGLED':
      return state.updateIn(['dashboard', 'activeSubmenu'], (submenu) => {
        const newSubmenu = action.payload.submenu;
        if (submenu === newSubmenu) {
          return null;
        }

        return newSubmenu;
      });

    case 'COMPONENT_MINIMIZED':
      return state.update(
        'minimizedComponents',
        (components) => components.add(action.payload.componentName)
      );

    case 'COMPONENT_MAXIMIZED':
      return state.update(
        'minimizedComponents',
        (components) => components.delete(action.payload.componentName)
      );

    default:
      return state;
  }
}

export default ui;
