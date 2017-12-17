import ACE from 'brace';

function disableAutoClosing(editor) {
  editor.setBehavioursEnabled(false);
}

export function createAceEditor(element) {
  const editor = ACE.edit(element);
  editor.$blockScrolling = Infinity;
  const computedStyle = getComputedStyle(element.parentElement);
  disableAutoClosing(editor);
  editor.setOptions({
    fontFamily: computedStyle.getPropertyValue('font-family'),
    fontSize: computedStyle.getPropertyValue('font-size'),
  });
  return editor;
}

export function createAceSessionWithoutWorker(language, source = '') {
  const session = ACE.createEditSession(source, null);
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  session.setMode(`ace/mode/${language}`);
  return session;
}
