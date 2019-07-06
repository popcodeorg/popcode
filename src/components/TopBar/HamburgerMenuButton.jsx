import React from 'react';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function HamburgerMenuButton() {
  return <FontAwesomeIcon icon={faBars} size="lg" />;
}

HamburgerMenuButton.propTypes = {};
