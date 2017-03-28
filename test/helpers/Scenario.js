import reduce from '../../src/reducers';
import {
  projectCreated,
} from '../../src/actions/projects';
import Analyzer from '../../src/analyzers';

export default class Scenario {
  constructor() {
    this.projectKey = '123456';
    this.state = reduce(undefined, projectCreated(this.projectKey));
  }

  get project() {
    return this.state.getIn(['projects', this.projectKey]);
  }

  get analyzer() {
    return new Analyzer(this.project);
  }
}

