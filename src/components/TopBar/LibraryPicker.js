import map from 'lodash/map';
import PropTypes from 'prop-types';
import libraries from '../../config/libraries';
import createMenu from './createMenu';
import LibraryPickerButton from './LibraryPickerButton';
import LibraryPickerItem from './LibraryPickerItem';

const LibraryPicker = createMenu({
  name: 'libraryPicker',

  mapPropsToItems({enabledLibraries}) {
    return map(libraries, (library, key) => {
      const isEnabled = enabledLibraries.includes(key);

      return {
        key,
        isEnabled,
        props: {isEnabled, library},
      };
    });
  },
})(LibraryPickerButton, LibraryPickerItem);

LibraryPicker.propTypes = {
  enabledLibraries: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default LibraryPicker;
