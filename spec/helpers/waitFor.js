export default (timeout, clock) => {
  const promise = new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

  clock.tick(timeout);

  return promise;
};
