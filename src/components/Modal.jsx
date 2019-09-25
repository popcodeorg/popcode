import PropTypes from 'prop-types';
import React from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';

export default function Modal({children, isOpen, onClose}) {
  if (!isOpen) {
    return null;
  }

  function onContent(e) {
    e.stopPropagation();
  }

  return createPortal(
    <div className="modal" onClick={onClose}>
      <div className="modal__contents" onClick={onContent}>
        {children}
      </div>
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
