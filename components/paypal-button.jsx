import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array,
    submit: React.PropTypes.array.isRequired
  },
  onChange: function() {
    this.props.onClick = this.props.onClick || function() {};
    this.props.onClick();
    if (!this.props.submitting) {
      this.props.onSubmit(this.props.validate, this.props.submit);
    }
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="fa fa-cog fa-spin"/>{this.getIntlMessage('submitting')}</div>
      );
    }
    return (
      <span>
        <div className="row payment-logos paypal-logo">
          <p>&nbsp;</p>
        </div>
        <div className="row medium-label-size">PayPal</div>
      </span>
    );
  },
  render: function() {
    return (
      <div className="half paypal-button">
        <input onChange={this.onChange} type="radio" name="payment-type" value="paypal" id="payment-paypal"/>
        <label className="payment-submit-button" htmlFor="payment-paypal">
          {this.renderButton()}
        </label>
        <input type="hidden" name="item_name_monthly" value={this.getIntlMessage("mozilla_donation")}/>
      </div>
    );
  }
});

