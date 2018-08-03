import serialize from 'serialize-javascript';

export default function prettyPrint(value) {
  return serialize(value);
}
