import React from 'react';
import {IntlMixin} from 'react-intl';

var DonateButton = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <span><i className="fa fa-cog fa-spin"/>{this.getIntlMessage('submitting')}</span>
      );
    }
    return this.props.children;
  },
  render: function() {
    var errorMessageClassName = "row error-msg-row";
    var errorMessage = this.props.error.message;
    if (errorMessage === "") {
      errorMessageClassName += " hidden";
    }
    return (
      <div className="row submit-button">
        <div className="full">
          <button onClick={this.onClick} type="submit" className="submit-btn large-label-size">
            {this.renderButton()}
          </button>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="amount-error-msg">
              <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">
                  {errorMessage}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
