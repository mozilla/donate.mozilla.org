import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <div onClick={this.props.onClick} className="half">
        <input type="radio" name="payment-type" value="cc" id="payment-cc"/>
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
