import React from 'react';
import listener from '../scripts/listener.js';

var ErrorMessage = React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },
  render: function() {
    var message = this.props.message;
    var errorMessageClassName = "row error-msg-row";
    if (!message) {
      errorMessageClassName += " hidden";
    }
    return (
      <div className={errorMessageClassName}>
        <div className="full">
          <div id="amount-error-msg">
            <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
              <li className="parsley-custom-error-message">
                {message}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

var ErrorListener = React.createClass({
  propTypes: {
    errors: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    listener.on("formError", this.onError);
  },
  componentWillUnmount: function() {
    listener.off("formError", this.onError);
  },
  onError: function(e) {
    var detail = e.detail;
    var message = detail.message;
    var field = detail.field;
    if (this.props.errors.indexOf(field) >= 0) {
      this.setState({
        [field]: message
      });
    }
  },
  render: function() {
    var errors = this.props.errors;
    var state = this.state;
    return (
      <span>
        {errors.map(function(error, i) {
          return (
            <ErrorMessage key={i} message={state[error]}/>
          );
        })}
      </span>
    );
  }
});

module.exports = {
  ErrorMessage: ErrorMessage,
  ErrorListener: ErrorListener
};
