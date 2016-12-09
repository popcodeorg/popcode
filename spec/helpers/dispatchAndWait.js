import promiseTicks from './promiseTicks';

export default function dispatchAndWait(store, action) {
  store.dispatch(action);
  return promiseTicks(20);
}

