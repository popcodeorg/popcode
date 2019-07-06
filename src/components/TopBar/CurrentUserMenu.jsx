import isUndefined from 'lodash-es/isUndefined';

import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {t} from 'i18next';

import {UserAccount} from '../../records';

import createMenu, {MenuItem} from './createMenu';
import CurrentUserButton from './CurrentUserButton';

const CurrentUserMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'currentUser',

  renderItems({
    /* eslint-disable react/prop-types */
    onLinkGitHub,
    onLogOut,
    onUnlinkGitHub,
    user,
    /* eslint-enable react/prop-types */
  }) {
    const githubIdentityProvider = user.identityProviders.get('github.com');

    return (
      <Fragment>
        {isUndefined(githubIdentityProvider) ? (
          <MenuItem onClick={onLinkGitHub}>
            {t('top-bar.session.link-github')}
          </MenuItem>
        ) : (
          <MenuItem onClick={onUnlinkGitHub}>
            {t('top-bar.session.unlink-github', {
              displayName: githubIdentityProvider.displayName,
            })}
          </MenuItem>
        )}
        <MenuItem onClick={onLogOut}>
          {t('top-bar.session.log-out-prompt')}
        </MenuItem>
      </Fragment>
    );
  },
})(CurrentUserButton);

CurrentUserMenu.propTypes = {
  user: PropTypes.instanceOf(UserAccount),
  onLinkGitHub: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  onUnlinkGitHub: PropTypes.func.isRequired,
};

CurrentUserMenu.defaultProps = {
  user: null,
};

export default CurrentUserMenu;
