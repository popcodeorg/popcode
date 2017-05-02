import React from 'react';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash/bindAll';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import partial from 'lodash/partial';

import EditorContainer from './EditorContainer';
import Editor from './Editor';

function allErrorsFor(language, errors, runtimeErrors) {
  if (language === 'javascript') {
    return errors.javascript.items.concat(runtimeErrors);
  }
  return errors[language].items;
}

function getNodeHeights(refs) {
  return Array.from(refs).sort().map(([, node]) => {
    if (node) {
      const minHeight = window.getComputedStyle(node).minHeight;
      return {
        height: node.offsetHeight,
        minHeight: parseInt(minHeight.replace('px', ''), 10),
      };
    }
    return {};
  });
}

export default class EditorsColumn extends React.Component {
  constructor(props) {
    super(props);
    this.dividerRefs = new Map([[1, null], [2, null], [3, null]]);
    this.editorRefs = new Map([[1, null], [2, null], [3, null]]);
    bindAll(
      this,
      '_storeDividerRef',
      '_storeEditorRef',
      '_handleEditorDividerDrag',
    );
  }

  _storeEditorRef(index, editor) {
    this.editorRefs.set(index, editor);
  }

  _storeDividerRef(index, divider) {
    this.dividerRefs.set(index, divider);
  }

  _handleEditorDividerDrag(index, _, {deltaY, lastY, y}) {
    const {onUpdateFlex} = this.props;
    const editorHeights = getNodeHeights(this.editorRefs);
    const dividerHeights = getNodeHeights(this.dividerRefs);
    onUpdateFlex({deltaY, dividerHeights, editorHeights, index, lastY, y});
  }

  render() {
    const {
      currentProject,
      editorsFlex,
      errors,
      onComponentHide,
      onEditorInput,
      onRequestedLineFocused,
      runtimeErrors,
      ui,
    } = this.props;

    const children = [];
    const languages = ['html', 'css', 'javascript'].filter(language =>
      !includes(currentProject.hiddenUIComponents, `editor.${language}`),
    );
    languages.forEach((language, index) => {
      children.push(
        <EditorContainer
          key={language}
          language={language}
          source={currentProject.sources[language]}
          style={{flex: editorsFlex[index]}}
          onHide={partial(onComponentHide, `editor.${language}`)}
          onRef={partial(this._storeEditorRef, index)}
        >
          <Editor
            errors={allErrorsFor(language, errors, runtimeErrors)}
            key={language}
            language={language}
            percentageOfHeight={1 / languages.length}
            projectKey={currentProject.projectKey}
            requestedFocusedLine={ui.editors.requestedFocusedLine}
            source={currentProject.sources[language]}
            onInput={partial(onEditorInput, language)}
            onRequestedLineFocused={onRequestedLineFocused}
          />
        </EditorContainer>,
      );
      if (index < languages.length - 1) {
        children.push(
          <DraggableCore
            key={`divider:${language}`}
            onDrag={partial(this._handleEditorDividerDrag, index)}
          >
            <div
              className="editors__divider"
              ref={partial(this._storeDividerRef, index)}
            />
          </DraggableCore>,
        );
      }
    });

    if (isEmpty(children)) {
      return null;
    }

    return (
      <div className="environment__column">
        <div className="environment__columnContents editors">{children}</div>
      </div>
    );
  }
}

EditorsColumn.propTypes = {
  currentProject: React.PropTypes.object.isRequired,
  editorsFlex: React.PropTypes.array.isRequired,
  errors: React.PropTypes.object.isRequired,
  runtimeErrors: React.PropTypes.array.isRequired,
  ui: React.PropTypes.shape({
    editors: React.PropTypes.object.isRequired,
  }).isRequired,
  onComponentHide: React.PropTypes.func.isRequired,
  onEditorInput: React.PropTypes.func.isRequired,
  onRequestedLineFocused: React.PropTypes.func.isRequired,
  onUpdateFlex: React.PropTypes.func.isRequired,
};
