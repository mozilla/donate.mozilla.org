var React = require('react');
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var PrivacyPolicyInput = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      values: {
        checked: false
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
        checked: e.currentTarget.checked
      }
    });
    this.props.onChange(this.props.name, this);
  },
  validate: function() {
    var valid = this.state.values.checked;
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
      <div id="privacy-policy" className="full">
        <div className="row cc-additional-info">
          <div className="full">
            <input type="checkbox" onChange={this.onChange} checked={this.state.values.checked} name="legal_confirm" id="legalConfirm"/>
            <label htmlFor="legalConfirm">
              <FormattedHTMLMessage message={ this.getIntlMessage("privacy_policy") } />
            </label>
          </div>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="privacy-error-msg">
              <ul id="parsley-id-multiple-legal_confirm" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">{this.getIntlMessage('pp_acknowledge')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PrivacyPolicyInput;
