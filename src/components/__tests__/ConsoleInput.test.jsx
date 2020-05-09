import CodeMirror from 'codemirror';
import find from 'lodash-es/find';
import findLast from 'lodash-es/findLast';
import isObject from 'lodash-es/isObject';
import last from 'lodash-es/last';
import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

import {EditorLocation} from '../../records';
import CodeMirrorConsoleInput from '../ConsoleInput';

import {change as changeFactory} from '@factories/packages/codemirror';

const DEFAULT_PROPS = {
  currentInputValue: 'initialValue',
  onChange: jest.fn(),
  onInput: jest.fn(),
  onNextConsoleHistory: jest.fn(),
  onPreviousConsoleHistory: jest.fn(),
  onRequestedLineFocused: jest.fn(),
};

function buildComponent(props = {}) {
  return <CodeMirrorConsoleInput {...DEFAULT_PROPS} {...props} />;
}

function shallowRenderComponent(props = {}) {
  const renderer = new ShallowRenderer();
  renderer.render(buildComponent(props));
  return renderer.getRenderOutput();
}

function renderComponent(props = {}) {
  const container = {__stub: 'console__editor'};
  let component;
  act(() => {
    component = TestRenderer.create(buildComponent(props), {
      createNodeMock(element) {
        if (!/\bconsole__editor\b/u.test(element.props.className)) {
          throw new Error(`Got unexpected ref: ${JSON.stringify(element)}`);
        }
        return container;
      },
    });
  });
  return {component, container};
}

test('renders HTML with correct class structure', () => {
  const container = shallowRenderComponent();
  expect(container.type).toBe('div');
  expect(container.props.className.split(' ')).toInclude('console__row');
  expect(container.props.className.split(' ')).toInclude('console__input');
  const editorContainer = find(
    container.props.children,
    child =>
      isObject(child.props) &&
      child.props.className.split(' ').includes('console__editor'),
  );
  expect(editorContainer).not.toBeNil();
});

describe('codemirror editor', () => {
  let component, container, editor;

  function updateComponent(props = {}) {
    act(() => {
      component.update(buildComponent(props));
    });
  }

  function getExtraKeys() {
    const [, extraKeys] = findLast(editor.setOption.mock.calls, {
      0: 'extraKeys',
    });
    return extraKeys;
  }

  beforeEach(() => {
    ({component, container} = renderComponent());

    editor = last(CodeMirror.mock.results).value;
  });

  test('initialize CodeMirror instance', () => {
    expect(CodeMirror).toHaveBeenCalledWith(
      container,
      expect.objectContaining({
        autofocus: true,
        electricChars: false,
        lineNumbers: false,
        mode: 'javascript',
        scrollbarStyle: null,
        smartIndent: false,
      }),
    );
  });

  test('update editor contents', () => {
    const newValue = 'newValue';
    updateComponent({currentInputValue: newValue});
    expect(editor.setValue).toHaveBeenCalledWith(newValue);
  });

  test('no-op editor update', () => {
    editor.setValue.mockClear();
    const newValue = DEFAULT_PROPS.currentInputValue;
    editor.getValue.mockReturnValue(newValue);
    updateComponent({currentInputValue: newValue});
    expect(editor.setValue).not.toHaveBeenCalled();
  });

  test('typing in editor', () => {
    const [, editorOnChanges] = find(editor.on.mock.calls, {0: 'changes'});
    const newValue = 'newValue';
    editor.getValue.mockReturnValue(newValue);

    editorOnChanges(null, [changeFactory.build()]);

    expect(DEFAULT_PROPS.onChange).toHaveBeenCalledWith(newValue);
  });

  test('change from setValue', () => {
    const [, editorOnChanges] = find(editor.on.mock.calls, {0: 'changes'});
    const newValue = 'newValue';
    editor.getValue.mockReturnValue(newValue);

    editorOnChanges(null, [changeFactory.build({origin: 'setValue'})]);

    expect(DEFAULT_PROPS.onChange).not.toHaveBeenCalled();
  });

  test('console entry', () => {
    const {Enter: enterHandler} = getExtraKeys();

    const value = DEFAULT_PROPS.currentInputValue;
    editor.getValue.mockReturnValue(value);
    enterHandler();

    expect(DEFAULT_PROPS.onInput).toHaveBeenCalledWith(value);
  });

  test('navigation to previous', () => {
    const {Up: upHandler} = getExtraKeys();
    upHandler();
    expect(DEFAULT_PROPS.onPreviousConsoleHistory).toHaveBeenCalledWith();
  });

  test('navigation to next', () => {
    const {Down: downHandler} = getExtraKeys();
    downHandler();
    expect(DEFAULT_PROPS.onNextConsoleHistory).toHaveBeenCalledWith();
  });

  test('requestedFocusedLine', () => {
    updateComponent({
      requestedFocusedLine: new EditorLocation({component: 'console'}),
    });
    expect(editor.focus).toHaveBeenCalledWith();
    expect(DEFAULT_PROPS.onRequestedLineFocused).toHaveBeenCalledWith();
  });

  test('requestedFocusedLine for different component', () => {
    updateComponent({
      requestedFocusedLine: new EditorLocation({component: 'editor.html'}),
    });
    expect(editor.focus).not.toHaveBeenCalled();
    expect(DEFAULT_PROPS.onRequestedLineFocused).not.toHaveBeenCalled();
  });
});
