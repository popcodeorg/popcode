import {createLogic} from 'redux-logic';

import {unlinkGithub} from '../clients/firebase';
import {identityUnlinked} from '../actions/user';

export default createLogic({
  type: 'UNLINK_GITHUB_IDENTITY',
  async process() {
    await unlinkGithub();
    return identityUnlinked('github.com');
  },
});
