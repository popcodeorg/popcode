import swal from 'sweetalert';

const windowParent = window.parent;
const windowName = window.name;

window.onerror = (fullMessage, _file, line, column, error) => {
  let name, message;
  if (error) {
    ({name, message} = error);
  } else {
    const components = fullMessage.split(': ', 2);
    if (components.length === 2) {
      [name, message] = components;
    } else {
      name = 'Error';
      message = fullMessage;
    }
  }

  windowParent.postMessage(JSON.stringify({
    type: 'org.popcode.error',
    windowName,
    payload: {
      name,
      message,
      line,
      column,
    },
  }), '*');
};

// eslint-disable-next-line no-eval
const globalEval = window.eval;

window.addEventListener('message', ({data: message}) => {
  let type, expression, key;
  try {
    ({type, payload: {key, expression}} = JSON.parse(message));
  } catch (_e) {
    return;
  }

  if (type !== 'org.popcode.console.expression') {
    return;
  }

  try {
    const value = globalEval(expression);
    windowParent.postMessage(JSON.stringify({
      type: 'org.popcode.console.value',
      windowName,
      payload: {key, value},
    }), '*');
  } catch (error) {
    windowParent.postMessage(JSON.stringify({
      type: 'org.popcode.console.error',
      windowName,
      payload: {key, error: {name: error.name, message: error.message}},
    }), '*');
  }
});

Object.defineProperties(window, { // eslint-disable-line prefer-reflect
  alert: {
    value: (message) => {
      swal(String(message));
    },
    configurable: true,
  },
  prompt: {
    value: (message, defaultValue = '') => defaultValue,
    configurable: true,
  },
});
