import test from 'tape';
import testSaga from 'redux-saga-test-plan';
import {userDoneTyping as userDoneTypingSaga} from '../../../src/sagas/ui';
import {userDoneTyping} from '../../../src/actions/ui';

test('userDoneTyping', (assert) => {
  testSaga(userDoneTypingSaga).
    next().put(userDoneTyping()).
    next().isDone();

  assert.end();
});
