import {faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import partial from 'lodash-es/partial';
import classnames from 'classnames';

export default function CollapsedComponent({
  component,
  isRightJustified = true,
  onComponentUnhide,
  projectKey,
  text,
}) {
  return (
    <div
      className="editors__collapsed-editor"
      onClick={partial(
        onComponentUnhide,
        projectKey,
        `editor.${component}`,
      )}
    >
      <div
        className={classnames(
          'label',
          'editors__label',
          'editors__label_collapsed',
          {editors__label_left: !isRightJustified},
        )}
      >
        {text}
        {' '}
        <FontAwesomeIcon icon={faChevronUp} />
      </div>
    </div>
  );
}

CollapsedComponent.propTypes = {
  component: PropTypes.string.isRequired,
  isRightJustified: PropTypes.bool.isRequired,
  projectKey: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onComponentUnhide: PropTypes.func.isRequired,
};
