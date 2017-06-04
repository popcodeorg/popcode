import assign from 'lodash/assign';
import promiseRetry from 'promise-retry';

export default function performWithRetries(
  perform,
  errorsToRetry = [],
  options = {},
) {
  return promiseRetry(
    retry => perform().catch((error) => {
      if (errorsToRetry.includes(error.message)) {
        return retry(error);
      }
      return Promise.reject(error);
    }),
    assign({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
    }, options),
  );
}
