function afterImmediate(cb) {
  return new Promise((resolve) => {
    setImmediate(() => {
      resolve(cb());
    });
  });
}

export default afterImmediate;
