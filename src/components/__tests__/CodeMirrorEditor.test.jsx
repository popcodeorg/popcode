import CodeMirror from 'codemirror';
import findLast from 'lodash-es/findLast';
import last from 'lodash-es/last';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer, {act} from 'react-test-renderer';

import CodeMirrorEditor from '../CodeMirrorEditor';

import {errorFactory} from '../../../../../../../home/mat/src/popcode/__factories__/records/Error';

import {change as changeFactory} from '@factories/packages/codemirror';

const DEFAULT_PROPS = {
  errors: [],
  language: 'html',
  projectKey: '0',
  source: '<!doctype html>\n<html>\n</html>',
  onAutoFormat: jest.fn(),
  onInput: jest.fn(),
  onRequestedLineFocused: jest.fn(),
};

function buildComponent(props = {}) {
  return <CodeMirrorEditor {...DEFAULT_PROPS} {...props} />;
}

function shallowRenderComponent(props = {}) {
  return new ShallowRenderer().render(buildComponent(props));
}

function renderComponent(props = {}) {
  const container = {__stub: 'editors__codemirror-container'};
  let component;
  act(() => {
    component = TestRenderer.create(buildComponent(props), {
      createNodeMock(element) {
        if (
          !/\beditors__codemirror-container\b/u.test(element.props.className)
        ) {
          throw new Error(`Got unexpected ref: ${JSON.stringify(element)}`);
        }
        return container;
      },
    });
  });
  return {component, container};
}

describe('large text', () => {
  test('not on by default', () => {
    const {
      props: {className},
    } = shallowRenderComponent();

    expect(className.split(' ')).not.toContain(
      'editors__codemirror-container_large-text',
    );
  });

  test('on if prop is true', () => {
    const {
      props: {className},
    } = shallowRenderComponent({textSizeIsLarge: true});

    expect(className.split(' ')).toContain(
      'editors__codemirror-container_large-text',
    );
  });
});

describe('codemirror editor', () => {
  let component, container, editor;
  beforeEach(() => {
    ({container, component} = renderComponent());
    editor = last(CodeMirror.mock.results).value;
  });

  function updateComponent(props = {}) {
    act(() => {
      component.update(buildComponent(props));
    });
  }

  test('initial editor setup', () => {
    expect(CodeMirror).toHaveBeenLastCalledWith(container, expect.any(Object));
    expect(editor.setSize).toHaveBeenLastCalledWith('100%', '100%');

    expect(CodeMirror.Doc).toHaveBeenLastCalledWith('', 'htmlmixed');
    expect(editor.swapDoc).toHaveBeenLastCalledWith(
      last(CodeMirror.Doc.mock.instances),
    );

    expect(editor.setValue).toHaveBeenLastCalledWith(DEFAULT_PROPS.source);
  });

  test('swapping docs', () => {
    updateComponent({projectKey: '1'});
    const [doc0, doc1] = CodeMirror.Doc.mock.instances;
    expect(editor.swapDoc).toHaveBeenLastCalledWith(doc1);

    updateComponent();
    expect(editor.swapDoc).toHaveBeenLastCalledWith(doc0);

    editor.swapDoc.mockClear();
    updateComponent();
    expect(editor.swapDoc).not.toHaveBeenCalled();
  });

  test('updating source', () => {
    const newSource = DEFAULT_PROPS.source.replace(
      '<html>',
      '<html><body></body>',
    );
    updateComponent({source: newSource});
    expect(editor.setValue).toHaveBeenLastCalledWith(newSource);

    editor.setValue.mockClear();
    updateComponent({source: newSource});
    expect(editor.setValue).not.toHaveBeenCalled();
  });

  test('change listener', () => {
    const [, handleChanges] = findLast(editor.on.mock.calls, {0: 'changes'});
    expect(DEFAULT_PROPS.onInput).not.toHaveBeenCalled();

    const newSource = DEFAULT_PROPS.source.replace('<html>', '<html>d');
    editor.getValue.mockReturnValueOnce(newSource);
    handleChanges(null, [changeFactory.build({origin: '+input'})]);
    expect(DEFAULT_PROPS.onInput).toHaveBeenLastCalledWith(newSource);

    DEFAULT_PROPS.onInput.mockClear();
    handleChanges(null, [changeFactory.build({origin: 'setValue'})]);
    expect(DEFAULT_PROPS.onInput).not.toHaveBeenCalled();
  });

  test('errors', () => {
    function getAnnotations() {
      const [, {getAnnotations: getAnnotationsFromEditor}] = findLast(
        editor.setOption.mock.calls,
        {
          0: 'lint',
        },
      );
      return getAnnotationsFromEditor();
    }

    expect(getAnnotations()).toEqual([]);
    const error = errorFactory.build();
    updateComponent({errors: [error]});
    expect(getAnnotations()).toEqual([
      {
        message: error.text,
        severity: 'error',
        from: {line: error.row, ch: 0},
        to: {line: error.row, ch: 0},
      },
    ]);
    updateComponent({errors: []});
    expect(getAnnotations()).toEqual([]);
  });
});
