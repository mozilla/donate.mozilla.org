import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { ErrorMessage } from './error.jsx';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

var EmailInput = React.createClass({
  propTypes: {
    info: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    intlID: React.PropTypes.string
  },
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      email: "",
      showHint: false,
      valid: true,
      errorMessage: ""
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: "email"
    });
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "email") {
      this.setState({
        email: detail.value
      });
    }
  },
  validate: function() {
    var valid = !!this.state.email;
    var errorMessage = "";
    if (!this.refs.inputElement.validity.valid) {
      valid = false;
      errorMessage = this.context.intl.formatMessage({id: 'email_invalid'});
    }
    if (!this.state.email || !this.state.email.trim()) {
      form.error("email", this.context.intl.formatMessage({id: "please_complete"}));
    }
    this.setState({
      valid: valid,
      errorMessage: errorMessage
    });
    return valid;
  },
  onEmailChange: function(e) {
    this.setState({
      valid: true,
      errorMessage: ""
    });
    form.updateField("email", e.currentTarget.value);
  },
  hintClicked: function() {
    this.setState({
      showHint: !this.state.showHint
    });
  },
  renderHint: function() {
    var hintClassIconName = "fa fa-question-circle hint";
    var hintClassName = "hint-msg small";
    var intlID = this.props.intlID;
    if (this.state.showHint) {
      hintClassIconName += " on";
    } else {
      hintClassName += " hidden";
    }
    if (intlID) {
      return (
        <span>
          <i onClick={this.hintClicked} className={hintClassIconName}></i>
          <div className={hintClassName}>
            <FormattedHTMLMessage id={intlID}/>
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
    return (
      <div className="email-input">
        <div className="row hint-msg-parent">
          <div className="full">
            <div className="field-container">
              <i className="fa fa-envelope field-icon"></i>
              <input type="email" ref="inputElement" className={inputClassName} name="email" value={this.state.email} onChange={this.onEmailChange} placeholder={this.context.intl.formatMessage({id: 'email'})}/>
              {this.renderHint()}
            </div>
          </div>
        </div>

        <ErrorMessage message={this.state.errorMessage}/>
      </div>
    );
  }
});

module.exports = EmailInput;
