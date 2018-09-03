import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
// import {t} from 'i18next';

import Modal from './Modal';

export default function TestResultsPane({
  isTestResultsPaneOpen,
  testResults,
  onCloseTestResultsPane,
}) {
  if (!isTestResultsPaneOpen) {
    return null;
  }
  const results = [];
  for (const testResult of testResults) {
    if (testResult.type === 'test') {
      results.push(<p>{testResult.name}</p>);
    } else if (testResult.type === 'assert') {
      results.push(
        <p
          className={classnames(
            'test-results__failed',
            {'test-results__passed': testResult.ok},
          )}
          // key={}
        >
          {
            testResult.ok ?
              'Passed!' :
              `Not Passed: The test expected ${testResult.expected} but actually got ${testResult.actual}`
          }
        </p>,
      );
    }
  }

  return (
    <Modal>
      <div>
        <div>
          <h2> Test Results </h2>
          {results}
        </div>
        <div className="test-results__buttons">
          <button
            className={classnames(
              'test-results__button',
            )}
            onClick={onCloseTestResultsPane}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

TestResultsPane.propTypes = {
  isTestResultsPaneOpen: PropTypes.bool.isRequired,
  testResults: PropTypes.array.isRequired,
  onCloseTestResultsPane: PropTypes.func.isRequired,
};

TestResultsPane.defaultProps = {

};
