import channel from './channel';
import createScopedEvaluationChain from './createScopedEvaluationChain';
import jsonParser from './jsonParser';

let evalNext = createScopedEvaluationChain(next => {
  evalNext = next;
});

export default function handleConsoleExpressions() {
  channel.bind('evaluateExpression', (_trans, expression) =>
    jsonParser(evalNext(expression)),
  );
}
