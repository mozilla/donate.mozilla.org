import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  onChange: function() {
    this.props.onClick = this.props.onClick || function() {};
    this.props.onClick();
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  render: function() {
    return (
      <div className="half paypal-button">
        <input onChange={this.onChange} type="radio" name="payment-type" value="paypal" id="payment-paypal"/>
        <label className="payment-submit-button" htmlFor="payment-paypal">
          <div className="row payment-logos paypal-logo">
            <p>&nbsp;</p>
          </div>
          <div className="row medium-label-size">PayPal</div>
        </label>
        <input type="hidden" name="item_name_monthly" value={this.getIntlMessage("mozilla_donation")}/>
      </div>
    );
  }
});

