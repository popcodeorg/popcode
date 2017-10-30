import isNil from 'lodash/isNil';
import promiseRetry from 'promise-retry';

let promisedLinters;

export default function importLinters() {
  if (isNil(promisedLinters)) {
    promisedLinters = promiseRetry(
      retry => import('./linters').catch(retry),
    ).catch((error) => {
      promisedLinters = null;
      return Promise.reject(error);
    });
  }

  return promisedLinters;
}
