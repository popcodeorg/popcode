import isNull from 'lodash-es/isNull';

import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {t} from 'i18next';

import {UserIdentityProvider} from '../../records';

import createMenu, {MenuItem} from './createMenu';
import CurrentUserButton from './CurrentUserButton';

const CurrentUserMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'currentUser',

  renderItems({
    /* eslint-disable react/prop-types */
    githubIdentityProvider,
    onLinkGitHub,
    onLogOut,
    onUnlinkGitHub,
    /* eslint-enable react/prop-types */
  }) {
    return (
      <Fragment>
        {
          isNull(githubIdentityProvider) ? (
            <MenuItem onClick={onLinkGitHub}>
              {t('top-bar.session.link-github')}
            </MenuItem>
          ) : (
            <MenuItem onClick={onUnlinkGitHub}>
              {t(
                'top-bar.session.unlink-github',
                {displayName: githubIdentityProvider.displayName},
              )}
            </MenuItem>
          )
        }
        <MenuItem onClick={onLogOut}>
          {t('top-bar.session.log-out-prompt')}
        </MenuItem>
      </Fragment>
    );
  },
})(CurrentUserButton);

CurrentUserMenu.propTypes = {
  githubIdentityProvider: PropTypes.instanceOf(UserIdentityProvider),
  onLinkGitHub: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
};

CurrentUserMenu.defaultProps = {
  githubIdentityProvider: null,
};

export default CurrentUserMenu;
