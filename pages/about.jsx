import React from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import SmallPrint from '../components/small-print.jsx';
import SingleForm from '../components/single-form.jsx';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var className = "row additional-info-container new-flow-test";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="heart-image" height="100" width="107" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
            <div>
              <img className="mozilla-watermark" src="/assets/images/mozilla.5e83dba715a0469b92071758876f0373.svg"/>
              <span>{this.getIntlMessage('additional_info')}</span>
            </div>
          </div>
          <SingleForm
            currency={this.props.currency}
            presets={this.props.presets}
            amount={this.props.amount}
            frequency={this.props.frequency}
            country={this.props.country}
            locales={this.props.locales}
          />
        </div>
        <SmallPrint stripeNotice={true} />
        <MozillaFooter/>
      </div>
    );
  }
});
