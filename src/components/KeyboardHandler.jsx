import mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import {useEffect} from 'react';

export default function KeyboardHandler({onSave}) {
  useEffect(() => {
    mousetrap.bind('mod+s', () => {
      onSave();
      return false;
    });

    return () => {
      mousetrap.unbind('mod+s');
    };
  }, [onSave]);

  return null;
}

KeyboardHandler.propTypes = {
  onSave: PropTypes.func.isRequired,
};
