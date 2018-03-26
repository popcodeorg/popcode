import promiseRetry from 'promise-retry';

export default function retryingFailedImports(importThunk) {
  return promiseRetry(retry => importThunk().catch(retry));
}
