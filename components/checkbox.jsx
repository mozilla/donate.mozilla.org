import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import Error from '../components/error-message.jsx';

var Checkbox = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      values: {
        [this.props.type]: false
      },
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
    this.setState({
      values: {
        [this.props.type]: e.currentTarget.checked
      }
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
    var message = "";
    if (!this.state.valid) {
      message = this.props.error;
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
        <Error message={message}/>
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
