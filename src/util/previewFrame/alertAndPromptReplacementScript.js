const alertAndPromptReplacementScript = `(${function() {
  const _swal = window.swal;

  Object.defineProperties(window, { // eslint-disable-line prefer-reflect
    alert: {
      value: (message) => {
        _swal(String(message));
      },
      configurable: true,
    },
    prompt: {
      value: (message, defaultValue = '') => defaultValue,
      configurable: true,
    },
  });

  delete window.swal; // eslint-disable-line prefer-reflect
}.toString()}());`;

export default alertAndPromptReplacementScript;
