import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var Checkbox = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    var values = {};
    values[this.props.type] = false;
    return {
      values: values,
      valid: true
    };
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this);
  },
  onChange: function(e) {
    this.setState({
      valid: true
    });
    var values = {};
    values[this.props.type] = e.currentTarget.checked;
    this.setState({
      values: values
    });
    this.props.onChange(this.props.name, this);
  },
  validate: function() {
    var valid = this.state.values[this.props.type];
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
    var type = this.props.type;
    return (
      <div className="full checkbox">
        <div className="row">
          <div className="full">
            <input type="checkbox" onChange={this.onChange} checked={this.state.values[type]} name="legal_confirm" id={this.props.id}/>
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
          type="privacyPolicy"
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
            type="signup"
          />
        </div>
      );
    }
  })
};
