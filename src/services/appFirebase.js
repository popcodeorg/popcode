import Firebase from 'firebase';
import config from '../config';

const appFirebase = new Firebase(
  `https://${config.firebaseApp}.firebaseio.com`
);

export default appFirebase;
