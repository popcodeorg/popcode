import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

export default function HamburgerMenuButton() {
  return <FontAwesomeIcon icon={faBars} size="lg" />;
}

HamburgerMenuButton.propTypes = {};
