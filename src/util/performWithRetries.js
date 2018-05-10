import assign from 'lodash-es/assign';
import promiseRetry from 'promise-retry';

export default function performWithRetries(
  perform,
  shouldRetryFn = () => false,
  options = {},
) {
  return promiseRetry(
    retry => perform().catch((error) => {
      if (shouldRetryFn(error.message)) {
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
