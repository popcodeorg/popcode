import React from 'react';
import i18n from 'i18next-client';

function EditorContainer(props) {
  let helpText;

  if (props.source === '') {
    helpText = (
      <div className="editors-editorContainer-helpText">
        {i18n.t(
          'editors.helpText',
          {language: props.language}
        )}
      </div>
    );
  }

  return (
    <div className="editors-editorContainer">
      <div
        className="editors-editorContainer-label container-label"
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
