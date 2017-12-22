import channel from './channel';

export default function handleErrors() {
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

    channel.notify({
      method: 'error',
      params: {name, message, line, column},
    });
  };
}
