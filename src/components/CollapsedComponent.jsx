import {faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import partial from 'lodash-es/partial';
import classnames from 'classnames';

export default function CollapsedComponent({
  component,
  isRightJustified,
  onComponentUnhide,
  projectKey,
  text,
}) {
  return (
    <div
      className="collapsed-component"
      onClick={partial(onComponentUnhide, projectKey, component)}
    >
      <div
        className={classnames('label', 'collapsed-component__label', {
          'collapsed-component__label_left': !isRightJustified,
        })}
      >
        {text} <FontAwesomeIcon icon={faChevronUp} />
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

CollapsedComponent.defaultProps = {
  isRightJustified: true,
};
