export default (instance, key, options, expected, description) => assert => {
  const actual = instance.t(key, options);
  let message = `Expected:\n"${expected}",\n\nActual:\n"${actual}"`;
  if (description) {
    message = `${description}\n\n${message}`;
  }

  assert.ok(actual === expected, message);

  assert.end();
};
