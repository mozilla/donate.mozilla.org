import React from 'react';
import ThunderbirdFooter from '../../components/footer-thunderbird.jsx';
import SmallPrint from '../../components/small-print-thunderbird.jsx';
import SingleForm from '../../components/single-form.jsx';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var className = "row additional-info-container thunderbird";
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="internet-graphic" width="224" src="/assets/images/thunderbird/thunderbird-logo-wordmark-small.png"/>
            <div>{this.getIntlMessage('additional_info_thunderbird')}</div>
          </div>
          <SingleForm
            appName="thunderbird"
            currency={this.props.currency}
            presets={this.props.presets}
            amount={this.props.amount}
            frequency={this.props.frequency}
            country={this.props.country}
            locales={this.props.locales}
          />
        </div>
        <SmallPrint stripeNotice={true} />
        <ThunderbirdFooter/>
      </div>
    );
  }
});
