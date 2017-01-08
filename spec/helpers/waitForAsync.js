export default function waitForAsync() {
  return new Promise(resolve => setTimeout(resolve));
}
