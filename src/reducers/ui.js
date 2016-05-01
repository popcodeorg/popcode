import Immutable from 'immutable';

const defaultState = new Immutable.Map().
  set('minimizedComponents', new Immutable.Set()).
  setIn(['dashboard', 'isOpen'], false);

function ui(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'DASHBOARD_TOGGLED':
      return state.updateIn(['dashboard', 'isOpen'], (isOpen) => !isOpen);

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
