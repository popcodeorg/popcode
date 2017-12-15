import Channel from 'jschannel';

export default Channel.build({window: window.parent, origin: '*'});
