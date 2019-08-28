import PropTypes from 'prop-types';
import React from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import property from 'lodash-es/property';

export default function Modal({children, isOpen, onClose}) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal">
      <ModalContents onClose={onClose}>{children}</ModalContents>
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

const ModalContents = onClickOutside(
  ({children}) => {
    return <div className="modal__contents">{children}</div>;
  },
  {
    handleClickOutside: property('props.onClose'),
  },
);
