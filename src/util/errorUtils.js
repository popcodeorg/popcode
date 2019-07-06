import normalizeError from './normalizeError';

export function noValidationErrors(errors) {
  return !errors.find(list =>
    list.get('items').find(error => error.get('phase') === 'validation'),
  );
}

export function createError(error) {
  const ErrorConstructor = window[error.name] || Error;
  return normalizeError(new ErrorConstructor(error.message));
}
