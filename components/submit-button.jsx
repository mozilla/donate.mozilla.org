import React from 'react';
import {IntlMixin} from 'react-intl';
import listener from '../scripts/listener.js';

var DonateButton = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      error: ""
    };
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
    if (field === "other") {
      this.setState({
        error: message
      });
    }
  },
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
    var errorMessage = this.state.error;
    if (errorMessage === "") {
      errorMessageClassName += " hidden";
    }
    return (
      <div className="row submit-button">
        <div className="full">
          <button onClick={this.onClick} name={this.props.name || "submit-button"} type="submit" className="submit-btn large-label-size">
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
