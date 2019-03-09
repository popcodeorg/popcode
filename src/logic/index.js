import unlinkGithubIdentity from './unlinkGithubIdentity';

import {all} from 'redux-saga/effects';

export default function* rootLogic() {
  yield all([unlinkGithubIdentity()]);
}
