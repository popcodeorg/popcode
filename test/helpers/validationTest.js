import map from 'lodash-es/map';
import orderBy from 'lodash-es/orderBy';
import pick from 'lodash-es/pick';

export default function validationTest(input, validate, ...expectedErrors) {
  return async(assert) => {
    try {
      const errors = await validate(input);
      assert.deepEqual(
        map(
          orderBy(errors, ['reason', 'row']),
          error => pick(error, ['reason', 'row', 'payload']),
        ),
        orderBy(expectedErrors, ['reason', 'row']),
      );
    } catch (e) {
      assert.error(e);
    }
    assert.end();
  };
}
