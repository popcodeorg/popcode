export default function promiseTicks(n) {
  if (n === 0) {
    return Promise.resolve();
  }
  return Promise.resolve().then(() => promiseTicks(n - 1));
}
