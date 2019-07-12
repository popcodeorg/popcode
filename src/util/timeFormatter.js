import {format} from 'date-fns';

export function dateToString(date) {
  if (date) {
    return format(date).format('MMM Do [at] h:mm A');
  }
  return null;
}
