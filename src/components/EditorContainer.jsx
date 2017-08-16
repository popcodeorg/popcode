import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

function EditorContainer(props) {
  let helpText;

  if (props.source === '') {
    helpText = (
      <div className="editors__help-text">
        {t(
          'editors.help-text',
          {language: props.language},
        )}
      </div>
    );
  }

  return (
    <div
      className="editors__editor-container"
      ref={props.onRef}
      style={props.style}
    >
      <div
        className="environment__label"
        onClick={props.onHide}
      >
        {t(`languages.${props.language}`)}
        {' '}
        <span className="u__icon">&#xf078;</span>
      </div>
      {helpText}
      {props.children}
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
