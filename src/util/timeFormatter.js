import moment from 'moment';

export function dateToString(date) {
  if (date) {
    return moment(date).format('MMM Do [at] h:mm A');
  }
  return null;
}
