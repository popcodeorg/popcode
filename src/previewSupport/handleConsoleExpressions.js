import channel from './channel';
import createScopedEvaluationChain from './createScopedEvaluationChain';

let evalNext = createScopedEvaluationChain((next) => {
  evalNext = next;
});

export default function handleConsoleExpressions() {
  channel.bind(
    'evaluateExpression',
    (_trans, expression) => evalNext(expression),
  );
}
