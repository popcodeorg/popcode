import waitForAsync from './waitForAsync';

export default function dispatchAndWait(store, action) {
  store.dispatch(action);
  return waitForAsync();
}

