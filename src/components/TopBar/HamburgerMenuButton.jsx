import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(faBars);

export default function HamburgerMenuButton() {
  return (
    <FontAwesomeIcon icon="bars" size="lg" />
  );
}

HamburgerMenuButton.propTypes = {};
