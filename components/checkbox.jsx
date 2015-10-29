import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import dispatcher from '../scripts/input-dispatcher.js';

var Checkbox = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      valid: true
    };
  },
  componentDidMount: function() {
    dispatcher.fieldReady({
      name: this.props.name,
      element: this,
      field: this.props.field
    });
  },
  onCheck: function(e) {
    this.setState({
      valid: true
    });
    dispatcher.fire("heightChange");
    dispatcher.fieldChange({
      field: this.props.field,
      value: e.currentTarget.checked
    });
  },
  validate: function() {
    var valid = this.props.checked;
    this.setState({
      valid: valid
    });
    return valid;
  },
  render: function() {
    var errorMessageClassName = "row error-msg-row";
    if (this.state.valid) {
      errorMessageClassName += " hidden";
    }
    return (
      <div className="full checkbox">
        <div className="row">
          <div className="full">
            <input type="checkbox" onChange={this.onCheck} checked={this.props.checked} name="legal_confirm" id={this.props.id}/>
            <label htmlFor={this.props.id}>
              <FormattedHTMLMessage message={ this.props.message } />
            </label>
          </div>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="privacy-error-msg">
              <ul id="parsley-id-multiple-legal_confirm" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">{this.props.error}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  PrivacyPolicyCheckbox: React.createClass({
    mixins: [IntlMixin],
    render: function() {
      return (
        <Checkbox
          {...this.props}
          message={this.getIntlMessage("privacy_policy")}
          error={this.getIntlMessage('pp_acknowledge')}
          id="privacy-policy-checkbox"
          field="privacyPolicy"
        />
      );
    }
  }),
  SignupCheckbox: React.createClass({
    mixins: [IntlMixin],
    render: function() {
      return (
        <div className="signup-checkbox">
          <Checkbox
            {...this.props}
            message={this.getIntlMessage("yes_i_want_to_keep_in_touch")}
            id="signup-checkbox"
            field="signup"
          />
        </div>
      );
    }
  })
};
