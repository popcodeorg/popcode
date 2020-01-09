import map from 'lodash-es/map';
import sortBy from 'lodash-es/sortBy';
import pick from 'lodash-es/pick';

export default async function validationTest(
  input,
  validate,
  ...expectedErrors
) {
  const errors = await validate(input);
  expect(
    map(sortBy(errors, ['reason', 'row']), error =>
      pick(error, ['reason', 'row', 'payload']),
    ),
  ).toEqual(sortBy(expectedErrors, ['reason', 'row']));
}
