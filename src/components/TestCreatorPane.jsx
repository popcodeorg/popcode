import React from 'react';
import PropTypes from 'prop-types';
import isNull from 'lodash-es/isNull';
import partial from 'lodash-es/partial';
import classnames from 'classnames';
import {t} from 'i18next';

import TestCreatorPaneEditor from './TestCreatorPaneEditor';
import Modal from './Modal';

export default function TestCreatorPane({
  isTestCreatorPaneOpen,
  projectKey,
  tests,
  onAddTest,
  onCloseTestCreatorPane,
  onSaveTests,
}) {
  if (isNull(projectKey) || !isTestCreatorPaneOpen) {
    return null;
  }

  return (
    <Modal>
      <div>
        <div className="test-creator__heading">
          <p>
            {t('tests.creator-title')}
            <a href="https://github.com/dwyl/learn-tape">{t('tests.creator-title-tape')}</a>
          </p>
          <button
            className={classnames(
              'test-creator__button',
              'test-creator__button_add-test',
            )}
            onClick={partial(onAddTest, projectKey)}
          >
            {t('tests.add-test')}
          </button>
        </div>
        <div className="test-creator__editor">
          <TestCreatorPaneEditor
            projectKey={projectKey}
            tests={tests}
            onSaveTests={onSaveTests}
          />
        </div>
        <div className="">
          <button
            className={classnames(
              'test-creator__button',
              'test-creator__button_close',
            )}
            onClick={onCloseTestCreatorPane}
          >
            {t('tests.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

TestCreatorPane.propTypes = {
  isTestCreatorPaneOpen: PropTypes.bool.isRequired,
  projectKey: PropTypes.string,
  tests: PropTypes.string.isRequired,
  onAddTest: PropTypes.func.isRequired,
  onCloseTestCreatorPane: PropTypes.func.isRequired,
  onSaveTests: PropTypes.func.isRequired,
};

TestCreatorPane.defaultProps = {
  projectKey: null,
};
