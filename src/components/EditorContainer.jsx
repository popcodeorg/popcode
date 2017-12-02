import prefixAll from 'inline-style-prefixer/static';
import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'i18next';

function EditorContainer({children, language, source, style, onHide, onRef}) {
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
      ref={onRef}
      style={prefixAll(style)}
    >
      <div
        className="label editors__label editors__label_expanded"
        onClick={onHide}
      >
        {t(`languages.${language}`)}
        {' '}
        <span className="u__icon">&#xf078;</span>
      </div>
      {helpText}
      {children}
    </div>
  );
}

EditorContainer.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
};

export default EditorContainer;
