import channel from './channel';

// eslint-disable-next-line no-eval
const globalEval = window.eval;

export default function handleConsoleExpressions() {
  channel.bind(
    'evaluateExpression',
    (_trans, expression) => JSON.stringify(globalEval(expression)),
  );
}
