import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';

import createMenu, {MenuItem} from './createMenu';
import CurrentUserButton from './CurrentUserButton';

const CurrentUserMenu = createMenu({
  menuClass: 'top-bar__menu_right',
  name: 'currentUser',

  // eslint-disable-next-line react/prop-types
  renderItems({onLogOut}) {
    return (
      <MenuItem onClick={onLogOut}>
        {t('top-bar.session.log-out-prompt')}
      </MenuItem>
    );
  },
})(CurrentUserButton);

CurrentUserMenu.propTypes = {
  onLogOut: PropTypes.func.isRequired,
};

export default CurrentUserMenu;
