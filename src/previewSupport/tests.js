import tapeTest from 'tape';

import channel from './channel';

const test = tapeTest;

export function handleTestResults(shouldRunTests, tests) {
  const testStream = test.createStream({objectMode: true});
  // eslint-disable-next-line no-eval
  eval(tests);
  testStream.on('data', (row) => {
    channel.notify({
      method: 'testResult',
      params: row,
    });
  });
}

export function handleTestRuns() {
  channel.bind('runTests', (_trans, {shouldRunTests, tests}) => {
    if (shouldRunTests) {
      handleTestResults(shouldRunTests, tests);
    }
  });
}
