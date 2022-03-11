import Swal from 'sweetalert2';

export default function overrideAlert() {
  let pendingAlerts = [];

  Object.defineProperties(window, {
    alert: {
      value: async message => {
        if (pendingAlerts.length) {
          pendingAlerts.push(message);
          return;
        }

        pendingAlerts.push(message);

        for (const pendingAlert of pendingAlerts) {
          // eslint-disable-next-line no-await-in-loop
          await Swal.fire({text: String(pendingAlert)});
        }
        pendingAlerts = [];
      },
      configurable: true,
    },
    prompt: {
      value: (message, defaultValue = '') => defaultValue,
      configurable: true,
    },
  });
}
