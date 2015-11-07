import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import dispatcher from '../scripts/input-dispatcher.js';

var EmailInput = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      showHint: false,
      valid: true,
      errorMessage: ""
    };
  },
  componentDidMount: function() {
    dispatcher.fieldReady({
      name: this.props.name,
      element: this,
      field: "email"
    });
  },
  validate: function() {
    var valid = !!this.props.value;
    var errorMessage = "";
    if (!this.refs.inputElement.getDOMNode().validity.valid) {
      valid = false;
      errorMessage = this.getIntlMessage('email_invalid');
    }
    this.setState({
      valid: valid,
      errorMessage: errorMessage
    });
    return valid;
  },
  onEmailChange: function(e) {
    this.setState({
      valid: true
    });
    dispatcher.fieldChange({
      field: "email",
      value: e.currentTarget.value
    });
  },
  hintClicked: function() {
    this.setState({
      showHint: !this.state.showHint
    });
    dispatcher.fire("heightChange");
  },
  renderHint: function() {
    var hintClassIconName = "fa fa-question-circle hint";
    var hintClassName = "hint-msg small";
    var info = this.props.info;
    if (this.state.showHint) {
      hintClassIconName += " on";
    } else {
      hintClassName += " hidden";
    }
    if (info) {
      return (
        <span>
          <i onClick={this.hintClicked} className={hintClassIconName}></i>
          <div className={hintClassName}>
            <FormattedHTMLMessage message={info}/>
          </div>
        </span>
      );
    }
  },
  render: function() {
    var inputClassName = "";
    if (!this.state.valid) {
      inputClassName += "parsley-error";
    }
    var errorMessageClassName = "row error-msg-row";
    if (!this.state.errorMessage) {
      errorMessageClassName += " hidden";
    }
    return (
      <div className="email-input">
        <div className="row hint-msg-parent">
          <div className="full">
            <div className="field-container">
              <i className="fa fa-envelope field-icon"></i>
              <input type="email" ref="inputElement" className={inputClassName} name="email" value={this.props.value} onChange={this.onEmailChange} placeholder={this.getIntlMessage('email')}/>
              {this.renderHint()}
            </div>
          </div>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="amount-error-msg">
              <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">
                  {this.state.errorMessage}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EmailInput;
