import isString from 'lodash/isString';
import channel from './channel';
// eslint-disable-next-line no-eval
const globalEval = window.eval;

function reducer(accumulator, currentValue) {
  let evaluatedValue;
  if (isString(currentValue)) {
    evaluatedValue = currentValue;
  } else {
    evaluatedValue = globalEval(currentValue);
  }

  return `${accumulator} ${JSON.stringify(evaluatedValue)}`;
}

function notifyChannel(args) {
  if (args.length > 0) {
    const output = args.reduce(reducer);
    channel.notify({
      method: 'log',
      params: {output},
    });
  }
}

export default function handleConsoleLogs() {
  /* eslint-disable no-console */
  const browserConsoleLog = console.log.bind(console);
  const browserConsoleDebug = console.debug.bind(console);
  const browserConsoleInfo = console.info.bind(console);
  const browserConsoleWarn = console.warn.bind(console);
  const browserConsoleError = console.error.bind(console);
  /* eslint-enable no-console */

  Object.defineProperties(console, {
    log: {
      value: (...args) => {
        notifyChannel(args);
        browserConsoleLog(...args);
      },
    },
    debug: {
      value: (...args) => {
        notifyChannel(args);
        browserConsoleDebug(...args);
      },
    },
    info: {
      value: (...args) => {
        notifyChannel(args);
        browserConsoleInfo(...args);
      },
    },
    warn: {
      value: (...args) => {
        notifyChannel(args);
        browserConsoleWarn(...args);
      },
    },
    error: {
      value: (...args) => {
        notifyChannel(args);
        browserConsoleError(...args);
      },
    },
  });
}
