import React from 'react';

import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';
import Console from '../containers/Console';

export default function Output() {
  return (
    <div className="output">
      <Preview />
      <Console />
      <ErrorReport />
    </div>
  );
}
