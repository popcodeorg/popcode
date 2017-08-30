import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import partial from 'lodash/partial';
import preventClickthrough from 'react-prevent-clickthrough';
import libraries from '../../config/libraries';
import LibraryPickerItem from './LibraryPickerItem';

export default function LibraryPicker({
  enabledLibraries,
  isOpen,
  onLibraryToggled,
}) {
  if (!isOpen) {
    return null;
  }

  const libraryButtons = map(libraries, (library, key) => (
    <LibraryPickerItem
      enabled={enabledLibraries.includes(key)}
      key={key}
      library={library}
      onLibraryToggled={partial(onLibraryToggled, key)}
    />
  ));

  return (
    <div
      className="top-bar__menu"
      onClick={preventClickthrough}
    >
      {libraryButtons}
    </div>
  );
}

LibraryPicker.propTypes = {
  enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onLibraryToggled: PropTypes.func.isRequired,
};
