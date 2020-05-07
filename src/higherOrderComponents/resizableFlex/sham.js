import {List} from 'immutable';
import constant from 'lodash-es/constant';
import noop from 'lodash-es/noop';
import times from 'lodash-es/times';
import React from 'react';

export default function resizableFlex(size) {
  const props = {
    isFlexResizingSupported: false,
    resizableFlexGrow: new List(times(size, constant(null))),
    resizableFlexRefs: times(size, () => noop),
    onResizableFlexDividerDrag: noop,
  };

  return Component => {
    function WrappedComponent(ownProps) {
      return <Component {...props} {...ownProps} />;
    }
    WrappedComponent.displayName = `ResizableFlex.sham(${
      Component.displayName || Component.name
    }`;
    return WrappedComponent;
  };
}
