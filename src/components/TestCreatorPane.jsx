import React from 'react';
import PropTypes from 'prop-types';
import isNull from 'lodash-es/isNull';
import partial from 'lodash-es/partial';
import classnames from 'classnames';
// import {t} from 'i18next';

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
      <div className="">
        <div>
          <h2>Write your tests</h2>
          <p
            onClick={partial(onAddTest, projectKey)}
          >
            Add Test
          </p>
        </div>
        <div className="test-creator-pane__editor">
          <TestCreatorPaneEditor
            projectKey={projectKey}
            tests={tests}
            onSaveTests={onSaveTests}
          />
        </div>
        <div className="">
          <button
            className={classnames('instructions-editor__menu-button',
              'instructions-editor__menu-button_secondary',
            )}
            onClick={onCloseTestCreatorPane}
          >
            Close
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
