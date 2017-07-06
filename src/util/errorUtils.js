export function noValidationErrors(errors) {
  return !errors.find(
    list => list.get('items').find(
      error => error.get('phase') === 'validation',
    ),
  );
}
