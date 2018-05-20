import test from 'tape';
import {List, Map} from 'immutable';
import partial from 'lodash-es/partial';

import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/resizableFlex';
import {updateResizableFlex} from '../../../src/actions/resizableFlex';

const initialState = new Map();

test('updateResizableFlex', (t) => {
  t.test('from initial state with one update', reducerTest(
    reducer,
    initialState,
    partial(
      updateResizableFlex,
      'test',
      [{index: 0, flexGrow: 1.1}],
    ),
    initialState.set('test', new List([1.1])),
  ));

  t.test('from initial state with multiple updates', reducerTest(
    reducer,
    initialState,
    partial(
      updateResizableFlex,
      'test',
      [{index: 0, flexGrow: 1.1}, {index: 1, flexGrow: 0.9}],
    ),
    initialState.set('test', new List([1.1, 0.9])),
  ));

  t.test('from initial state with multiple non-initial updates', reducerTest(
    reducer,
    initialState,
    partial(
      updateResizableFlex,
      'test',
      [{index: 1, flexGrow: 1.1}, {index: 2, flexGrow: 0.9}],
    ),
    initialState.set('test', new List([undefined, 1.1, 0.9])),
  ));

  t.test('updates to existing flex', reducerTest(
    reducer,
    initialState.set('test', new List([1.1, 0.9])),
    partial(
      updateResizableFlex,
      'test',
      [{index: 0, flexGrow: 1.2}, {index: 1, flexGrow: 0.8}],
    ),
    initialState.set('test', new List([1.2, 0.8])),
  ));

  t.test('updates partially overlapping existing flex', reducerTest(
    reducer,
    initialState.set('test', new List([1.1, 0.9])),
    partial(
      updateResizableFlex,
      'test',
      [{index: 1, flexGrow: 1.3}, {index: 2, flexGrow: 0.7}],
    ),
    initialState.set('test', new List([1.1, 1.3, 0.7])),
  ));
});
