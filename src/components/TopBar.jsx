import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Wordmark from '../static/images/wordmark.svg';
import Pop from './Pop';

function uiVariants({validationState, isUserTyping}) {
  if (validationState === 'passed') {
    return {popVariant: 'neutral'};
  }
  if (validationState === 'validating') {
    return {popVariant: 'thinking', modifier: 'top-bar_yellow'};
  }
  if (validationState === 'validation-error' && isUserTyping) {
    return {popVariant: 'thinking', modifier: 'top-bar_yellow'};
  }
  return {popVariant: 'horns', modifier: 'top-bar_red'};
}

export default function TopBar({
  isHamburgerMenuActive,
  isUserTyping,
  validationState,
  onClickHamburgerMenu,
}) {
  const {popVariant, modifier} = uiVariants({validationState, isUserTyping});

  return (
    <div className={classnames('top-bar', modifier)}>
      <div
        className={classnames(
          'top-bar__hamburger',
          'u__fontawesome',
          {'top-bar__hamburger_active': isHamburgerMenuActive},
        )}
        onClick={onClickHamburgerMenu}
      >
        &#xf0c9;
      </div>
      <div className="top-bar__logo-container">
        <Pop variant={popVariant} />
      </div>
      <div className="top-bar__wordmark-container">
        <Wordmark />
      </div>
    </div>
  );
}

TopBar.propTypes = {
  isHamburgerMenuActive: PropTypes.bool.isRequired,
  isUserTyping: PropTypes.bool.isRequired,
  validationState: PropTypes.string.isRequired,
  onClickHamburgerMenu: PropTypes.func.isRequired,
};
