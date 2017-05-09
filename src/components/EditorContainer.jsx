import React from 'react';
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
    <div className="editors__editor-container">
      <div
        className="environment__label label"
        onClick={props.onHide}
      >
        {t(`languages.${props.language}`)}
      </div>
      {helpText}
      {props.children}
    </div>
  );
}

EditorContainer.propTypes = {
  children: React.PropTypes.node.isRequired,
  language: React.PropTypes.string.isRequired,
  source: React.PropTypes.string.isRequired,
  onHide: React.PropTypes.func.isRequired,
};

export default EditorContainer;
