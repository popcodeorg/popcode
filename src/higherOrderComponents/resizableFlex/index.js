import {connectAdvanced} from 'react-redux';
import at from 'lodash-es/at';
import findIndex from 'lodash-es/findIndex';
import isNull from 'lodash-es/isNull';
import map from 'lodash-es/map';
import merge from 'lodash-es/merge';
import shallowequal from 'shallowequal';
import times from 'lodash-es/times';
import {createSelector, defaultMemoize} from 'reselect';

import {makeGetResizableFlexGrow} from '../../selectors';
import {updateResizableFlex} from '../../actions';

import calculateFlexGrowAfterDrag from './calculateFlexGrowAfterDrag';
import directionAdapterFor from './directionAdapterFor';

let nextInstanceId = 1;

export default function resizableFlex(size) {
  const instanceId = (nextInstanceId++).toString();
  const getResizableFlexGrow = makeGetResizableFlexGrow(instanceId);

  return connectAdvanced(
    (dispatch) => {
      const regions = times(size, () => ({current: null}));
      const initialMainSizes = times(size, () => null);

      const stateIndependentFunctions = {
        onResizableFlexDividerDrag(beforeIndex, event, payload) {
          const afterIndex = findIndex(regions, 'current', beforeIndex + 1);
          const [{current: before}, {current: after}] =
            at(regions, [beforeIndex, afterIndex]);

          const {getCurrentSize, getDesiredSize} =
            directionAdapterFor(before);

          const [desiredBeforeFlexGrow, desiredAfterFlexGrow] =
            calculateFlexGrowAfterDrag(
              {
                currentFlexGrow: Number(
                  getComputedStyle(before)['flex-grow'],
                ),
                currentSize: getCurrentSize(before),
                desiredSize: getDesiredSize(before, payload),
                initialMainSize: initialMainSizes[beforeIndex],
              },
              {
                currentFlexGrow: Number(
                  getComputedStyle(after)['flex-grow'],
                ),
                currentSize: getCurrentSize(after),
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
          (region, index) => (element) => {
            region.current = element;
            if (isNull(element)) {
              initialMainSizes[index] = null;
              return;
            }

            const flexGrowWas = element.style.flexGrow;
            const flexShrinkWas = element.style.flexShrink;
            element.style.flexGrow = element.style.flexShrink = '0';
            initialMainSizes[index] = directionAdapterFor(element).
              getCurrentSize(element);
            element.style.flexGrow = flexGrowWas;
            element.style.flexShrink = flexShrinkWas;
          },
        ),
      };

      return createSelector(
        [
          getResizableFlexGrow,
          defaultMemoize(
            (_state, ownProps) => ownProps,
            shallowequal,
          ),
        ],
        (resizableFlexGrow, ownProps) => merge(
          {resizableFlexGrow},
          ownProps,
          stateIndependentFunctions,
        ),
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
