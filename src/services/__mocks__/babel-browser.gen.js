export function babelWithEnv() {
  return new Promise(resolve => resolve({
    code: '// Generated code',
    map: null,
  }));
}
