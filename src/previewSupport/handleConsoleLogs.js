import channel from './channel';
import prettyPrint from './prettyPrint';

const consoleFunctions = ['log', 'info', 'warn', 'error', 'debug'];

function notifyChannel(args) {
  if (args.length > 0) {
    channel.notify({
      method: 'log',
      params: args.map(prettyPrint).join(' '),
    });
  }
}

export default function handleConsoleLogs() {
  consoleFunctions.forEach((functionName) => {
    let browserFunction;
    // eslint-disable-next-line no-console
    if (console[functionName]) {
      // eslint-disable-next-line no-console
      browserFunction = console[functionName].bind(console);
    }

    Reflect.defineProperty(console, functionName, {
      value: (...args) => {
        notifyChannel(args);
        if (browserFunction) {
          browserFunction(...args);
        }
      },
    });
  });
}
