const messageHandlerScript = `(${function() {
  // eslint-disable-next-line no-eval
  const globalEval = window.eval;
  const windowName = window.name;
  const windowParent = window.parent;
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
}.toString()}());`;

export default messageHandlerScript;
