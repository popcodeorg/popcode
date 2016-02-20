import React from 'react';
import map from 'lodash/map';
import partial from 'lodash/partial';

import LibraryPickerItem from './LibraryPickerItem';
import config from '../config';

class LibraryPicker extends React.Component {
  _isLibraryEnabled(libraryKey) {
    return this.props.enabledLibraries.indexOf(libraryKey) !== -1;
  }

  render() {
    const libraries = map(config.libraries, (library, key) => (
      <LibraryPickerItem
        key={key}
        library={library}
        enabled={this._isLibraryEnabled(key)}
        onLibraryToggled={partial(this.props.onLibraryToggled, key)}
      />
    ));

    return <ul className="toolbar-menu">{libraries}</ul>;
  }
}

LibraryPicker.propTypes = {
  enabledLibraries: React.PropTypes.array.isRequired,
  onLibraryToggled: React.PropTypes.func.isRequired,
};

export default LibraryPicker;
