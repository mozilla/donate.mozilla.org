import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array.isRequired
  },
  onChange: function() {
    this.props.onClick = this.props.onClick || function() {};
    this.props.onClick();
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  render: function() {
    return (
      <div className="half">
        <input onChange={this.onChange} type="radio" name="payment-type" value="cc" id="payment-cc"/>
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
