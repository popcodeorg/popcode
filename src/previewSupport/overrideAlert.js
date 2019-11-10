import Swal from 'sweetalert2';

export default function overrideAlert() {
  Object.defineProperties(window, {
    alert: {
      value: message => {
        Swal.fire({text: String(message)});
      },
      configurable: true,
    },
    prompt: {
      value: (message, defaultValue = '') => defaultValue,
      configurable: true,
    },
  });
}
