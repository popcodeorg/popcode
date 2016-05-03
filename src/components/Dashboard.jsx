import React from 'react';
import i18n from 'i18next-client';

class Dashboard extends React.Component {
  _renderLoginState() {
    const currentUser = this.props.currentUser;

    if (currentUser.authenticated) {
      const name = currentUser.info.displayName || currentUser.info.username;

      return (
        <div className="dashboard-session">
          <img
            className="dashboard-session-avatar"
            src={currentUser.info.profileImageURL}
          />
          <span className="dashboard-session-name">{name}</span>
          <span
            className="dashboard-session-logInOut"
            onClick={this.props.onLogOut}
          >
            {i18n.t('dashboard.session.logOutPrompt')}
          </span>
        </div>
      );
    }
    return (
      <div className="dashboard-session">
        <span className="dashboard-session-name">
          {i18n.t('dashboard.session.notLoggedIn')}
        </span>
        <span
          className="dashboard-session-logInOut"
          onClick={this.props.onStartLogIn}
        >
          {i18n.t('dashboard.session.logInPrompt')}
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className="dashboard u-flexContainer u-flexContainer--column">
        {this._renderLoginState()}
        <div className="u-flexItem u-flexItem--fill"/>
      </div>
    );
  }
}

Dashboard.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  onStartLogIn: React.PropTypes.func.isRequired,
  onLogOut: React.PropTypes.func.isRequired,
};

export default Dashboard;
