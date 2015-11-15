import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import { ErrorMessage } from './error.jsx';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

var Checkbox = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired,
    field: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    error: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      valid: true,
      value: false
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: this.props.field
    });
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === this.props.field) {
      this.setState({
        value: detail.value
      });
    }
  },
  onCheck: function(e) {
    this.setState({
      valid: true
    });
    form.updateField(this.props.field, e.currentTarget.checked);
  },
  validate: function() {
    var valid = this.state.value;
    this.setState({
      valid: valid
    });
    return valid;
  },
  render: function() {
    var errorMessage = "";
    if (!this.state.valid) {
      errorMessage = this.props.error;
    }
    return (
      <div className="full checkbox">
        <div className="row">
          <div className="full">
            <input type="checkbox" onChange={this.onCheck} checked={this.state.value} name="legal_confirm" id={this.props.id}/>
            <label htmlFor={this.props.id}>
              <FormattedHTMLMessage message={ this.props.message } />
            </label>
          </div>
        </div>

        <ErrorMessage message={errorMessage}/>
      </div>
    );
  }
});

module.exports = {
  PrivacyPolicyCheckbox: React.createClass({
    mixins: [IntlMixin],
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
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
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
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
