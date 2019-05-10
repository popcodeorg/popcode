import {bind} from 'mousetrap';

import keyMap from '../util/keyMap';

import channel from './channel';

const {SAVE} = keyMap;

export default function handleKeyEvents() {
  bind(SAVE, () => {
    channel.notify({
      method: 'save',
    });
    return false;
  });
}
