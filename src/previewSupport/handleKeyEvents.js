import {bind} from 'mousetrap';

import channel from './channel';

export default function handleKeyEvents() {
  bind('mod+s', () => {
    channel.notify({
      method: 'save',
    });
    return false;
  });
}
