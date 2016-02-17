import React from 'react';
import map from 'lodash/map';
import partial from 'lodash/partial';

import LibraryPickerItem from './LibraryPickerItem';
import config from '../config';

var LibraryPicker = React.createClass({
  propTypes: {
    enabledLibraries: React.PropTypes.array.isRequired,
    onLibraryToggled: React.PropTypes.func.isRequired,
  },

  _isLibraryEnabled: function(libraryKey) {
    return this.props.enabledLibraries.indexOf(libraryKey) !== -1;
  },

  render: function() {
    var libraries = map(config.libraries, function(library, key) {
      return (
        <LibraryPickerItem
          key={key}
          library={library}
          enabled={this._isLibraryEnabled(key)}
          onLibraryToggled={partial(this.props.onLibraryToggled, key)}
        />
      );
    }.bind(this));

    return <ul className="toolbar-menu">{libraries}</ul>;
  },
});

module.exports = LibraryPicker;
