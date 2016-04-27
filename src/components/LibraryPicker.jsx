import React from 'react';
import map from 'lodash/map';
import partial from 'lodash/partial';

import LibraryPickerItem from './LibraryPickerItem';
import libraries from '../config/libraries';

class LibraryPicker extends React.Component {
  _isLibraryEnabled(libraryKey) {
    return this.props.enabledLibraries.indexOf(libraryKey) !== -1;
  }

  render() {
    const libraryButtons = map(libraries, (library, key) => (
      <LibraryPickerItem
        key={key}
        library={library}
        enabled={this._isLibraryEnabled(key)}
        onLibraryToggled={partial(this.props.onLibraryToggled, key)}
      />
    ));

    return <ul className="toolbar-menu">{libraryButtons}</ul>;
  }
}

LibraryPicker.propTypes = {
  enabledLibraries: React.PropTypes.array.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default LibraryPicker;
