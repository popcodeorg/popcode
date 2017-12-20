import channel from './channel';

function notifyChannel(args) {
  if (args.length > 0) {
    const output = args.map(arg => JSON.stringify(arg)).join(' ');
    channel.notify({
      method: 'log',
      params: {output},
    });
  }
}

export default function handleConsoleLogs() {
  const consoleFunctions = ['log', 'info', 'warn', 'error'];

  // eslint-disable-next-line no-console
  if (console.debug) {
    consoleFunctions.push('debug');
  }

  consoleFunctions.forEach((functionName) => {
    // eslint-disable-next-line no-console
    const browserFunction = console[functionName].bind(console);
    // eslint-disable-next-line prefer-reflect
    Object.defineProperty(console, functionName, {
      value: (...args) => {
        notifyChannel(args);
        browserFunction(...args);
      },
    });
  });
}
