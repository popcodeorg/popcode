import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {t} from 'i18next';

import createMenu, {MenuItem} from './createMenu';
import CurrentUserButton from './CurrentUserButton';

const CurrentUserMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'currentUser',

  // eslint-disable-next-line react/prop-types
  renderItems({isUserAuthenticatedWithGithub, onLinkGitHub, onLogOut}) {
    return (
      <Fragment>
        {
          !isUserAuthenticatedWithGithub && (
            <MenuItem onClick={onLinkGitHub}>
              {t('top-bar.session.link-github')}
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
  isUserAuthenticatedWithGithub: PropTypes.bool.isRequired,
  onLinkGitHub: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
};

export default CurrentUserMenu;
