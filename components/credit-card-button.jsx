import React from 'react';

var CreditCardButton = React.createClass({
  mixins: require('react-intl').IntlMixin,
  render: function() {
    return (
      <div className="half">
        <input type="radio" name="payment-type" value="paypal" id="payment-paypal" data-parsley-group="page-2" data-parsley-multiple="payment-type" data-parsley-errors-container="#payment-type-error-msg" data-parsley-required/>
        <label htmlFor="payment-paypal">
          <div className="row payment-logos paypal-logo">
            <p>&nbsp;</p>
          </div>
          <div className="row medium-label-size">PayPal</div>
        </label>
      </div>
    );
  }
})

module.exports = CreditCardButton;
