import React from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';

export default function Modal({children, isOpen}) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal">
      <div className="modal__contents">{children}</div>
    </div>,
    document.getElementById('modals'),
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
};

Modal.defaultProps = {
  isOpen: true,
};
