import {connect} from 'react-redux';

import {dismissAccountMigration, startAccountMigration} from '../actions';
import AccountMigration from '../components/AccountMigration';
import {getCurrentAccountMigration, getCurrentUser} from '../selectors';

function mapStateToProps(state) {
  return {
    currentUserAccount: getCurrentUser(state),
    migration: getCurrentAccountMigration(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDismiss() {
      dispatch(dismissAccountMigration());
    },

    onMigrate() {
      dispatch(startAccountMigration());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountMigration);
