const errorHandlerScript = `(${function() {
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

    window.parent.postMessage(JSON.stringify({
      type: 'org.popcode.error',
      error: {
        name,
        message,
        line,
        column,
      },
    }), '*');
  };
}.toString()}());`;

export default errorHandlerScript;
