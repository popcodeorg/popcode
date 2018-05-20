import {connectAdvanced} from 'react-redux';
import at from 'lodash-es/at';
import findIndex from 'lodash-es/findIndex';
import isNull from 'lodash-es/isNull';
import map from 'lodash-es/map';
import merge from 'lodash-es/merge';
import times from 'lodash-es/times';

import {makeGetResizableFlexGrow} from '../../selectors';
import {updateResizableFlex} from '../../actions';

import calculateFlexGrowAfterDrag from './calculateFlexGrowAfterDrag';

let nextInstanceId = 1;

export default function resizableFlex(size) {
  const instanceId = (nextInstanceId++).toString();
  const getResizableFlexGrow = makeGetResizableFlexGrow(instanceId);

  return connectAdvanced(
    (dispatch) => {
      const regions = times(size, () => ({current: null}));
      const initialMainSizes = times(size, () => null);

      return (state, ownProps) => merge(
        {
          onResizableFlexDividerDrag(beforeIndex, event, payload) {
            const afterIndex = findIndex(regions, 'current', beforeIndex + 1);
            const [{current: before}, {current: after}] =
              at(regions, [beforeIndex, afterIndex]);

            const [desiredBeforeFlexGrow, desiredAfterFlexGrow] =
              calculateFlexGrowAfterDrag(
                {
                  currentFlexGrow: Number(
                    getComputedStyle(before)['flex-grow'],
                  ),
                  currentSize: before.offsetHeight,
                  desiredSize: payload.y - before.offsetTop,
                  initialMainSize: initialMainSizes[beforeIndex],
                },
                {
                  currentFlexGrow: Number(
                    getComputedStyle(after)['flex-grow'],
                  ),
                  currentSize: after.offsetHeight,
                  initialMainSize: initialMainSizes[afterIndex],
                },
              );

            dispatch(updateResizableFlex(
              instanceId,
              [
                {index: beforeIndex, flexGrow: desiredBeforeFlexGrow},
                {index: afterIndex, flexGrow: desiredAfterFlexGrow},
              ],
            ));
          },

          resizableFlexRefs: map(
            regions,
            (region, index) => (ref) => {
              region.current = ref;
              if (isNull(ref)) {
                initialMainSizes[index] = null;
                return;
              }
              const flexGrowWas = ref.style.flexGrow;
              const flexShrinkWas = ref.style.flexShrink;
              ref.style.flexGrow = ref.style.flexShrink = '0';
              initialMainSizes[index] = ref.offsetHeight;
              ref.style.flexGrow = flexGrowWas;
              ref.style.flexShrink = flexShrinkWas;
            },
          ),

          resizableFlexGrow: getResizableFlexGrow(state),
        },

        ownProps,
      );
    },
    {
      getDisplayName(componentName) {
        return `ResizableFlex(${componentName})`;
      },
      methodName: 'resizableFlex',
    },
  );
}
