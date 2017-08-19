import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import classnames from 'classnames';

export default function Instructions({instructions, isOpen}) {
  if (!instructions || !isOpen) {
    return null;
  }

  return (
    <div
      className={classnames(
        'layout__instructions',
        'instructions',
        'u__flex-container',
        'u__flex-container_column',
      )}
    >
      {remark().use(remarkReact).processSync(instructions).contents}
    </div>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
