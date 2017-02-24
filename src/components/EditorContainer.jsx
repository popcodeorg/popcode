import React from 'react';
import i18n from 'i18next';

function EditorContainer(props) {
  let helpText;

  if (props.source === '') {
    helpText = (
      <div className="editors__help-text">
        {i18n.t(
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
        onClick={props.onMinimize}
      >
        {i18n.t(`languages.${props.language}`)}
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
  onMinimize: React.PropTypes.func.isRequired,
};

export default EditorContainer;
