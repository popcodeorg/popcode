import ACE from 'brace';

function disableAutoClosing(editor) {
  editor.setBehavioursEnabled(false);
}

export function inheritFontStylesFromParentElement(editor) {
  const computedStyle =
    getComputedStyle(editor.renderer.getContainerElement().parentElement);
  editor.setOptions({
    fontFamily: computedStyle.getPropertyValue('font-family'),
    fontSize: computedStyle.getPropertyValue('font-size'),
  });
}

export function createAceEditor(element) {
  const editor = ACE.edit(element);
  editor.$blockScrolling = Infinity;
  inheritFontStylesFromParentElement(editor);
  disableAutoClosing(editor);
  return editor;
}

export function createAceSessionWithoutWorker(language, source = '') {
  const session = ACE.createEditSession(source, null);
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  session.setMode(`ace/mode/${language}`);
  return session;
}
