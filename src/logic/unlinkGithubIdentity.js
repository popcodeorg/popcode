import {createLogic} from 'redux-logic';

import {identityUnlinked} from '../actions/user';
import {unlinkGithub} from '../clients/firebase';

export default createLogic({
  type: 'UNLINK_GITHUB_IDENTITY',
  async process() {
    await unlinkGithub();
    return identityUnlinked('github.com');
  },
});
