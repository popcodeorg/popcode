import channel from './channel';

export default function handleSourceUpdates() {
  channel.bind('updateSrc', (_trans, source) => {
    document.open();
    document.write(source);
  });
}
