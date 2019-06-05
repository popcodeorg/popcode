import {connect} from 'react-redux';
import uuid from 'uuid/v4';
import throttle from 'lodash-es/throttle';

import Preview from '../components/Preview';
import {
  addRuntimeError,
  consoleErrorProduced,
  consoleLogBatchProduced,
  consoleValueProduced,
  popOutProject,
  refreshPreview,
} from '../actions';
import {
  getCompiledProjects,
  getConsoleHistory,
  isCurrentProjectSyntacticallyValid,
  isUserTyping,
} from '../selectors';

function mapStateToProps(state) {
  return {
    compiledProjects: getCompiledProjects(state),
    consoleEntries: getConsoleHistory(state),
    showingErrors: (
      !isUserTyping(state) &&
        !isCurrentProjectSyntacticallyValid(state)
    ),
  };
}

function generateConsoleLogDispatcher(dispatch, timeout) {
  let queue = [];

  function flushQueue() {
    dispatch(consoleLogBatchProduced(queue));
    queue = [];
  }

  const throttledFlushQueue = throttle(flushQueue, timeout, {
    leading: true,
    trailing: true,
  });

  return function addLogEntry(value, compiledProjectKey) {
    queue.push({value, compiledProjectKey, key: uuid().toString()});
    throttledFlushQueue();
  };
}

function mapDispatchToProps(dispatch) {
  const dispatchConsoleLog = generateConsoleLogDispatcher(dispatch, 1000);
  return {
    onConsoleError(key, compiledProjectKey, error) {
      dispatch(consoleErrorProduced(key, compiledProjectKey, error));
    },

    onConsoleValue(key, value, compiledProjectKey) {
      dispatch(consoleValueProduced(key, value, compiledProjectKey));
    },

    onConsoleLog(value, compiledProjectKey) {
      dispatchConsoleLog(value, compiledProjectKey);
    },

    onPopOutProject() {
      dispatch(popOutProject());
    },

    onRefreshClick() {
      dispatch(refreshPreview(Date.now()));
    },

    onRuntimeError(error) {
      dispatch(addRuntimeError('javascript', error));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
