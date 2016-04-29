import Immutable from 'immutable';

const defaultState = new Immutable.Map().
  set('minimizedComponents', new Immutable.Set());

function ui(stateIn, action) {
  let state = stateIn;
  if (state === undefined) {
    state = defaultState;
  }

  switch (action.type) {
    case 'COMPONENT_MINIMIZED':
      return state.update(
        'minimizedComponents',
        (components) => components.add(action.payload.componentName)
      );

    default:
      return state;
  }
}

export default ui;
