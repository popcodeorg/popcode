/* global setImmediate */

function deferImmediate() {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

export default deferImmediate;
