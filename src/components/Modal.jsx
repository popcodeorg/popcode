import PropTypes from 'prop-types';
import React from 'react';
import {createPortal} from 'react-dom';

function onClickContent(e) {
  e.stopPropagation();
}
export default function Modal({children, isOpen, onClose}) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal" onClick={onClose}>
      <div className="modal__contents" onClick={onClickContent}>
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
