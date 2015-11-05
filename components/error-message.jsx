import React from 'react';

module.exports = React.createClass({
  render: function() {
    var messages = this.props.message || [];
    if (typeof messages === "string") {
      messages = [messages];
    }
    return (
      <span>
        {messages.map(function(message, i) {
          var errorMessageClassName = "row error-msg-row";
          if (!message) {
            errorMessageClassName += " hidden";
          }
          return (
            <div className={errorMessageClassName} key={i}>
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
        })}
      </span>
    );
  }
});
