import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, {forwardRef} from 'react';
import {t} from 'i18next';

import prefix from '../services/inlineStylePrefixer';

const EditorContainer = forwardRef(
  ({children, language, source, style, onHide}, ref) => {
    let helpText;

    if (source === '') {
      helpText = (
        <div className="editors__help-text">
          {t('editors.help-text', {language})}
        </div>
      );
    }

    return (
      <div
        className="editors__editor-container"
        ref={ref}
        style={prefix(style)}
      >
        <div
          className="label editors__label editors__label_expanded"
          onClick={onHide}
        >
          {t(`languages.${language}`)} <FontAwesomeIcon icon={faChevronDown} />
        </div>
        {helpText}
        {children}
      </div>
    );
  },
);

EditorContainer.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
};

EditorContainer.displayName = 'EditorContainer';

export default EditorContainer;
