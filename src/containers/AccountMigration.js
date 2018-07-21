import {connect} from 'react-redux';

import AccountMigration from '../components/AccountMigration';
import {getCurrentAccountMigration, getCurrentUser} from '../selectors';

function mapStateToProps(state) {
  return {
    currentUserAccount: getCurrentUser(state),
    migration: getCurrentAccountMigration(state),
  };
}

export default connect(
  mapStateToProps,
)(AccountMigration);
