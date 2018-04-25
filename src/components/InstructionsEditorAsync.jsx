import React from 'react';
import Coroutine from 'react-coroutine';

async function* InstructionsEditorAsync({
  instructions,
  projectKey,
  onCancelEditing,
  onContinueEditing,
  onSaveChanges,
}) {
  yield <span />;
  const {'default': InstructionsEditor} = await import('./InstructionsEditor');
  return (
    <InstructionsEditor
      instructions={instructions}
      projectKey={projectKey}
      onCancelEditing={onCancelEditing}
      onContinueEditing={onContinueEditing}
      onSaveChanges={onSaveChanges}
    />
  );
}

export default Coroutine.create(InstructionsEditorAsync);
