import tapeTest from 'tape';

import channel from './channel';

const test = tapeTest;

export function handleTestResults(shouldRunTests, tests) {
  try {
    const testStream = test.createStream({objectMode: true});
    // eslint-disable-next-line no-eval
    eval(tests);

    testStream.on('data', (row) => {
      channel.notify({
        method: 'testResult',
        params: row,
      });
    });
  } catch (e) {
    channel.notify({
      method: 'testResult',
      params: {error: 'error'},
    });
  }
}

export function handleTestRuns() {
  channel.bind('runTests', (_trans, {shouldRunTests, tests}) => {
    if (shouldRunTests) {
      handleTestResults(shouldRunTests, tests);
    }
  });
}
