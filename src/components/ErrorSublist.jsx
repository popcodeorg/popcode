import React from 'react';
import map from 'lodash/map';
import partial from 'lodash/partial';
import i18n from 'i18next-client';
import ErrorItem from './ErrorItem';

class ErrorSublist extends React.Component {
  render() {
    if (this.props.errors.length === 0) {
      return false;
    }

    const errors = map(this.props.errors, (error) => (
      <ErrorItem {...error}
        key={[error.reason, error.row]}
        onClick={partial(
          this.props.onErrorClicked,
          this.props.language
        )}
      />
    ));

    const errorMessage = i18n.t(
      'errors.notice',
      {amount: this.props.errors.length, language: this.props.language}
    );

    return (
      <div className="errorList-errorSublist">
        <h2 className="errorList-errorSublist-header">
          {errorMessage}
        </h2>
        <ul className="errorList-errorSublist-list">
          {errors}
        </ul>
      </div>
    );
  }
}

ErrorSublist.propTypes = {
  errors: React.PropTypes.array.isRequired,
  onErrorClicked: React.PropTypes.func.isRequired,
  language: React.PropTypes.oneOf(['html', 'css', 'javascript']).isRequired,
};

export default ErrorSublist;
