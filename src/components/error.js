import React from 'react';

var ErrorMessage = React.createClass({
  propTypes: {
    message: React.PropTypes.node
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
          <div id="error-msg">
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

module.exports = ErrorMessage;
