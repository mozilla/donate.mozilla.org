import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div className="half">
          <input type="radio" name="payment-type" value="cc" id="payment-cc" data-parsley-group="page-2" data-parsley-multiple="payment-type" data-parsley-errors-container="#payment-type-error-msg" data-parsley-required/>
          <label className="payment-submit-button" id="payment-cc-label" htmlFor="payment-cc">
            <div className="row payment-logos credit-card-logos">
              <p>&nbsp;</p>
            </div>
            <div className="row medium-label-size">{this.getIntlMessage('credit_card')}</div>
          </label>
      </div>
    );
  }
});
