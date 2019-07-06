import swal from 'sweetalert2';

export default function overrideAlert() {
  Object.defineProperties(window, {
    alert: {
      value: message => {
        swal(String(message));
      },
      configurable: true,
    },
    prompt: {
      value: (message, defaultValue = '') => defaultValue,
      configurable: true,
    },
  });
}
