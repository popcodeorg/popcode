import channel from './channel';
import createScopedEvaluationChain from './createScopedEvaluationChain';
import prettyPrint from './prettyPrint';

let evalNext = createScopedEvaluationChain((next) => {
  evalNext = next;
});

export default function handleConsoleExpressions() {
  channel.bind(
    'evaluateExpression',
    (_trans, expression) => prettyPrint(evalNext(expression)),
  );
}
