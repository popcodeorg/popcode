import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import mousetrap from 'mousetrap';

export default function KeyboardHandler({children, onSave}) {
  useEffect(() => {
    mousetrap.bind('mod+s', () => {
      onSave();
      return false;
    });

    return () => {
      mousetrap.unbind('mod+s');
    };
  }, [onSave]);

  return <>{children}</>;
}

KeyboardHandler.propTypes = {
  children: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};
