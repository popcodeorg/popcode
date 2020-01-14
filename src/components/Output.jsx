import React from 'react';

import Console from '../containers/Console';
import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';

export default function Output() {
  return (
    <div className="output">
      <Preview />
      <Console />
      <ErrorReport />
    </div>
  );
}
