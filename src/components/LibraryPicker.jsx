import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import partial from 'lodash/partial';
import libraries from '../config/libraries';
import LibraryPickerItem from './LibraryPickerItem';

class LibraryPicker extends React.Component {
  _isLibraryEnabled(libraryKey) {
    return this.props.enabledLibraries.indexOf(libraryKey) !== -1;
  }

  render() {
    const libraryButtons = map(libraries, (library, key) => (
      <LibraryPickerItem
        enabled={this._isLibraryEnabled(key)}
        key={key}
        library={library}
        onLibraryToggled={partial(this.props.onLibraryToggled, key)}
      />
    ));

    return <div className="dashboard__menu">{libraryButtons}</div>;
  }
}

LibraryPicker.propTypes = {
  enabledLibraries: PropTypes.array.isRequired,
  onLibraryToggled: PropTypes.func.isRequired,
};

export default LibraryPicker;
