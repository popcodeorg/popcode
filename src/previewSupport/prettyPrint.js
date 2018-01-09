import inspect from 'object-inspect';

export default function prettyPrint(value) {
  return inspect(value, {quoteStyle: 'double'});
}
