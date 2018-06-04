import {connect} from 'react-redux';

import Output from '../components/Output';
import {
  isDraggingColumnDivider,
  getOpenTopBarMenu,
} from '../selectors';

function mapStateToProps(state) {
  return {
    isDraggingColumnDivider: isDraggingColumnDivider(state),
    isAnyTopBarMenuOpen: Boolean(getOpenTopBarMenu(state)),
  };
}

export default connect(
  mapStateToProps,
)(Output);
