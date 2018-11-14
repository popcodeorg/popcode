import {eventChannel} from 'redux-saga';

import {onAuthStateChanged} from '../clients/firebase';

export default function makeLoginState() {
  return eventChannel(
    emitter => onAuthStateChanged(({user}) => {
      emitter({user});
    }),
  );
}
