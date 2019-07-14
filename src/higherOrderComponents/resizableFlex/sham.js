import {List} from 'immutable';
import React from 'react';
import times from 'lodash-es/times';
import noop from 'lodash-es/noop';

export default function resizableFlex(size) {
  const props = {
    isFlexResizingSupported: false,
    resizableFlexGrow: new List(times(size, () => null)),
    resizableFlexRefs: times(size, () => noop),
    onResizableFlexDividerDrag: noop,
  };

  return Component => {
    function WrappedComponent(ownProps) {
      return <Component {...props} {...ownProps} />;
    }
    WrappedComponent.displayName = `ResizableFlex.sham(${Component.displayName ||
      Component.name}`;
    return WrappedComponent;
  };
}
