import analyzers from '../analyzers';

function analyzeSource(language, source) {
  return (dispatch) => {
    const analyze = analyzers[language];
    if (!analyze) {
      return;
    }
    analyze(source).then((conditions) => {
      Object.keys(conditions).forEach((key) => {
        const condition = conditions[key];
        dispatch({
          type: condition.actionName,
          payload: condition.payload,
        });
      });
    });
  };
}

export {
  analyzeSource,
};
