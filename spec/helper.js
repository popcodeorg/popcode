import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import chaiAsPromised from 'chai-as-promised';

import '../src/init';
import '../src/actions';
import '../src/validations/linters';

chai.use(chaiAsPromised);
chai.use(chaiImmutable);
