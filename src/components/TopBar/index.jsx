import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import partial from 'lodash/partial';
import Wordmark from '../../static/images/wordmark.svg';
import Pop from '../Pop';
import CurrentUser from './CurrentUser';
import SnapshotButton from './SnapshotButton';
import TextSize from './TextSize';

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
  currentUser,
  isHamburgerMenuActive,
  isUserTyping,
  isSnapshotInProgress,
  isTextSizeLarge,
  openMenu,
  validationState,
  onClickHamburgerMenu,
  onClickMenu,
  onCreateSnapshot,
  onLogOut,
  onStartLogIn,
  onToggleTextSize,
}) {
  const {popVariant, modifier} = uiVariants({validationState, isUserTyping});

  return (
    <div className={classnames('top-bar', modifier)}>
      <div
        className={classnames(
          'top-bar__hamburger',
          'u__icon',
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
      <div className="top-bar__spacer" />
      <SnapshotButton
        isInProgress={isSnapshotInProgress}
        onClick={onCreateSnapshot}
      />
      <TextSize isLarge={isTextSizeLarge} onToggle={onToggleTextSize} />
      <CurrentUser
        isOpen={openMenu === 'currentUser'}
        user={currentUser}
        onClick={partial(onClickMenu, 'currentUser')}
        onLogOut={onLogOut}
        onStartLogIn={onStartLogIn}
      />
    </div>
  );
}

TopBar.propTypes = {
  currentUser: PropTypes.object.isRequired,
  isHamburgerMenuActive: PropTypes.bool.isRequired,
  isSnapshotInProgress: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool.isRequired,
  isUserTyping: PropTypes.bool.isRequired,
  openMenu: PropTypes.string,
  validationState: PropTypes.string.isRequired,
  onClickHamburgerMenu: PropTypes.func.isRequired,
  onClickMenu: PropTypes.func.isRequired,
  onCreateSnapshot: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  onStartLogIn: PropTypes.func.isRequired,
  onToggleTextSize: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  openMenu: null,
};
