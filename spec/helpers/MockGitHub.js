/* global sinon */

import GitHub from 'github-api';
import gitHub from '../../src/services/gitHub';

export default class MockGitHub {
  constructor(sandbox) {
    sandbox.stub(gitHub);
    this._anonymousClient = sinon.createStubInstance(GitHub);
    this._activeClient = this._anonymousClient;
    this._activeClient.getGist.returns({
      read: () => new Promise(() => {}),
    });
    gitHub.anonymous.returns(this._anonymousClient);
  }

  loadGist(data) {
    this._activeClient.getGist.withArgs(data.id).returns({
      read: () => Promise.resolve({data}),
    });
  }

  gistNotFound(gistId) {
    this._activeClient.getGist.withArgs(gistId).returns({
      read: () => Promise.reject({response: {status: 404}}),
    });
  }

  gistError(gistId) {
    this._activeClient.getGist.withArgs(gistId).returns({
      read: () => Promise.reject(new Error()),
    });
  }
}
