export async function processLogic({process, processOptions}, deps) {
  const dispatchReturn =
    'dispatchReturn' in processOptions
      ? processOptions.dispatchReturn
      : process.length === 1;

  const dispatch = jest.fn();
  if (dispatchReturn) {
    const actionToDispatch = await process(deps);
    dispatch(actionToDispatch);
  } else {
    await new Promise(resolve => {
      process(deps, dispatch, resolve);
    });
  }
  return dispatch;
}
