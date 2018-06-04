import classnames from 'classnames';
import map from 'lodash-es/map';
import partial from 'lodash-es/partial';
import PropTypes from 'prop-types';
import React from 'react';

import libraries from '../../config/libraries';

import createMenu, {MenuItem} from './createMenu';
import LibraryPickerButton from './LibraryPickerButton';

const LibraryPicker = createMenu({
  menuClass: 'top-bar__menu_left',
  name: 'libraryPicker',

  renderItems({enabledLibraries, onToggleLibrary}) {
    return map(libraries, (library, key) => {
      const isActive = enabledLibraries.includes(key);

      return (
        <MenuItem
          isActive={isActive}
          key={key}
          onClick={partial(onToggleLibrary, key)}
        >
          <span className={classnames('u__icon', {u__invisible: !isActive})}>
            &#xf00c;{' '}
          </span>
          {library.name}
        </MenuItem>
      );
    });
  },
})(LibraryPickerButton);

LibraryPicker.propTypes = {
  enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleLibrary: PropTypes.func.isRequired,
};

export default LibraryPicker;
