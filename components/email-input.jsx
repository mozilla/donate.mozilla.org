import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var EmailInput = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      showHint: false,
      values: {
        email: this.props.value || ""
      },
      valid: true,
      errorMessage: ""
    };
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this);
  },
  validate: function() {
    var valid = !!this.state.values.email;
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
    this.setState({
      values: {
        email: e.currentTarget.value
      }
    });
    this.props.onChange(this.props.name, this);
  },
  hintClicked: function() {
    this.setState({
      showHint: !this.state.showHint
    });
    this.props.onChange(this.props.name, this);
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
              <input type="email" ref="inputElement" className={inputClassName} name="email" value={this.state.values.email} onChange={this.onEmailChange} placeholder={this.getIntlMessage('email')}/>
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
