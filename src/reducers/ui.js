import Immutable from 'immutable';

const defaultState = new Immutable.Map().
  set('editors', new Immutable.Map({typing: false})).
  set('requestedLine', null).
  set('minimizedComponents', new Immutable.Set()).
  set('globalErrors', new Immutable.Set()).
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

    case 'USER_REQUESTED_FOCUSED_LINE':
      return state.setIn(
        ['editors', 'requestedFocusedLine'],
        new Immutable.Map().
          set('language', action.payload.language).
          set('line', action.payload.line).
          set('column', action.payload.column)
      );

    case 'EDITOR_FOCUSED_REQUESTED_LINE':
      return state.setIn(['editors', 'requestedFocusedLine'], null);

    case 'GLOBAL_ERROR_TRIGGERED':
      return state.update(
        'globalErrors',
        (errors) => errors.add(action.payload.errorType)
      );

    case 'USER_DISMISSED_GLOBAL_ERROR':
      return state.update(
        'globalErrors',
        (errors) => errors.remove(action.payload.errorType)
      );

    default:
      return state;
  }
}

export default ui;
