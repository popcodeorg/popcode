import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import chaiAsPromised from 'chai-as-promised';

import '../src/init';

chai.use(chaiAsPromised);
chai.use(chaiImmutable);
