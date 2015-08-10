import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  onClick: function() {
    $(".cc-additional-info").slideUp(100);
    $('.not-required-paypal').attr('required', false).attr('data-parsley-required', "false");
    $('#payment-paypal').click();
  },
  render: function() {
    return (
      <div className="half paypal-button">
          <input type="radio" name="payment-type" value="paypal" id="payment-paypal" data-parsley-group="page-2" data-parsley-multiple="payment-type" data-parsley-errors-container="#payment-type-error-msg" data-parsley-required/>
          <label className="payment-submit-button" htmlFor="payment-paypal">
            <button className="submit-button" type="submit" onClick={this.onClick} onSubmit={this.onSubmit} formAction="/paypal">
              <div className="row payment-logos paypal-logo">
                <p>&nbsp;</p>
              </div>
              <div className="row medium-label-size">PayPal</div>
            </button>
          </label>
          <input type="hidden" name="paypal_locale_code" value="US"/>
          <input type="hidden" name="paypal_currency_code" value="USD"/>
      </div>
    );
  }
});
