import {bind} from 'mousetrap';

import {keyMap} from '../util/keyMap';

import channel from './channel';

const {SAVE} = keyMap;

export default function handleKeyEvents() {
  bind(SAVE, handleSave);
}

function handleSave() {
  channel.notify({
    method: 'save',
  });
  return false;
}
