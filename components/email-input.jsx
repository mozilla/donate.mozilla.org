import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var EmailInput = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      showHint: false,
      values: {
        email: ""
      },
      valid: true
    };
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this);
  },
  validate: function() {
    var valid = !!this.state.values.email;
    this.setState({
      valid: valid
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
  render: function() {
    var hintClassIconName = "fa fa-question-circle hint";
    var hintClassName = "hint-msg small";
    if (this.state.showHint) {
      hintClassIconName += " on";
    } else {
      hintClassName += " hidden";
    }
    var inputClassName = "";
    if (!this.state.valid) {
      inputClassName += "parsley-error";
    }
    return (
      <div className="cc-additional-info" id="email-row">
        <div className="row hint-msg-parent">
          <div className="full">
            <div className="field-container">
              <i className="fa fa-envelope field-icon"></i>
              <input type="email" className={inputClassName} name="email" value={this.state.values.email} onChange={this.onEmailChange} placeholder={this.getIntlMessage('email')}/>
              <i onClick={this.hintClicked} className={hintClassIconName}></i>
              <div className={hintClassName}>
                <FormattedHTMLMessage message={ this.getIntlMessage("email_info") } />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EmailInput;
