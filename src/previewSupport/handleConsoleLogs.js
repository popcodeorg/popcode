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
        browserConsoleLog(...args);
      },
    },
    debug: {
      value: (...args) => {
        browserConsoleDebug(...args);
      },
    },
    info: {
      value: (...args) => {
        browserConsoleInfo(...args);
      },
    },
    warn: {
      value: (...args) => {
        browserConsoleWarn(...args);
      },
    },
    error: {
      value: (...args) => {
        browserConsoleError(...args);
      },
    },
  });
}
