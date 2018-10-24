import {createAction} from 'redux-actions';

export const updateSelectorLocations = createAction(
  'UPDATE_SELECTOR_LOCATIONS',
  selectors => ({selectors}),
  (_selectors, timestamp = Date.now()) => ({timestamp}),
);
