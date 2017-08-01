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

export default function TopBar({validationState, isUserTyping}) {
  const {popVariant, modifier} = uiVariants({validationState, isUserTyping});

  return (
    <div className={classnames('top-bar', modifier)}>
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
  isUserTyping: PropTypes.bool.isRequired,
  validationState: PropTypes.string.isRequired,
};
