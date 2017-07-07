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

  let plusMinus;
  if (props.textSizeIsLarge) {
      plusMinus = <span className="environment__label__toggleTextSize_plusMinus">&#xf068;</span>;
  } else {
      plusMinus = <span className="environment__label__toggleTextSize_plusMinus">&#xf067;</span>;
  }

  return (
    <div
      className="editors__editor-container"
      ref={props.onRef}
      style={props.style}
    >
      <div
        className="environment__label label"
        onClick={props.onHide}
      >
        {t(`languages.${props.language}`)}
      </div>
      <div
        className="environment__label_toggleTextSize label"
        onClick={props.onToggleEditorTextSize}
      >
          {plusMinus}
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
  textSizeIsLarge: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  onToggleEditorTextSize: PropTypes.func.isRequired,
};

export default EditorContainer;
