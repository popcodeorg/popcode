import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Modal from './Modal';

export default function TestResultsPane({
  isTestResultsPaneOpen,
  testResults,
  onCloseTestResultsPane,
}) {
  if (!isTestResultsPaneOpen) {
    return null;
  }

  const results = testResults.map(testResult => (
    <div
      key={testResult.id}
    >
      <p>{testResult.name}</p>
      {
        testResult.assertions.map(assertion => (
          <p
            className={classnames(
              'test-results__failed',
              {'test-results__passed': assertion.ok},
            )}
            key={`${testResult}${assertion.id}`}
          >
            {
              assertion.ok ?
                t('tests.passed') :
                t('tests.failed',
                  {expected: assertion.expected, actual: assertion.actual})
            }
          </p>
        )).valueSeq()
      }
    </div>
  )).valueSeq();

  return (
    <Modal>
      <div>
        <div>
          <h2> {t('tests.results-title')} </h2>
          {results}
        </div>
        <div className="test-results__buttons">
          <button
            className={classnames(
              'test-results__button',
              'test-creator__button_close',
            )}
            onClick={onCloseTestResultsPane}
          >
            {t('tests.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

TestResultsPane.propTypes = {
  isTestResultsPaneOpen: PropTypes.bool.isRequired,
  testResults: ImmutablePropTypes.iterable.isRequired,
  onCloseTestResultsPane: PropTypes.func.isRequired,
};
