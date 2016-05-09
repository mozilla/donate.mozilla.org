import React from 'react';
import { ErrorMessage } from './error.jsx';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    name: React.PropTypes.string.isRequired
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
            </div>
          </div>
        </div>

        <ErrorMessage message={this.state.errorMessage}/>
      </div>
    );
  }
});
