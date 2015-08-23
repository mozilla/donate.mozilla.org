import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  stripeCheckout: function() {
    var $theForm = $("#donation-form");
    var recurring = $('[name="recurring_acknowledge"]:checked').val() === '1';
    var description = this.getIntlMessage("donate_now");
    if (recurring) {
      description = this.getIntlMessage("donate_monthly");
    }

    var handler = StripeCheckout.configure({
      // Need to get this from .env
      key: 'pk_test_BZ0QTIwe7BVAk1ZDxOgWZ9Z6',
      image: '',
      token: function(token) {
            var formData = {};
            $theForm.serializeArray().map(function(x){formData[x.name] = x.value;});
            var transaction = {
              stripeToken: token.id,
              amount: formData.donation_amount,
              email: formData.email,
              recurring_acknowledge: formData.recurring_acknowledge,
              metadata: {
                firstname: formData.firstname,
                lastname: formData.lastname,
                country: formData.country,
                address: formData.addr1,
                city: formData.city,
                zip: formData.zip,
                state: formData.state_cd
              }
            };
            var submitDonation = $.ajax('/api/stripe', {
              type: 'POST',
              data: transaction,
              statusCode: {}
            });
            function submitSuccess(data, textStatus, XHR) {

              var transactionId = data.id;
              var amount;
              var currency;
              var donationFrequency;

              if (data.plan) {
                donationFrequency = 'monthly';
                currency = data.plan.currency;
                // Stripe plans are a multiple of the currencies equivilent of Cents
                // e.g. £5/month = 500 £0.01 subscriptions
                amount = data.quantity;
              } else {
                donationFrequency = 'one-time';
                amount = data.amount;
                currency = data.currency;
              }

              var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' +donationFrequency;
              var thankYouURL = '/thank-you/' + params;

              if (window.location.assign) {
                window.location.assign(thankYouURL);
              } else {
                window.location = thankYouURL;
              }

            }

            submitDonation.success(submitSuccess);
      }
    });

    // Open Checkout with further options
    handler.open({
      name: this.getIntlMessage("mozilla_donation"),
      description: description,
      // Stripe wants cents.
      amount: $("[name='donation_amount']:checked").val() * 100
    });
  },
  render: function() {
    return (
      <div className="half">
        <input type="radio" name="payment-type" value="cc" id="payment-cc" data-parsley-group="page-2" data-parsley-multiple="payment-type" data-parsley-errors-container="#payment-type-error-msg" data-parsley-required/>
        <label onClick={this.stripeCheckout} className="payment-submit-button" id="payment-cc-label" htmlFor="payment-cc">
          <div className="row payment-logos credit-card-logos">
            <p>&nbsp;</p>
          </div>
          <div className="row medium-label-size">{this.getIntlMessage('credit_card')}</div>
        </label>
      </div>
    );
  }
});
