import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import SmallPrint from '../components/small-print.js';
import SingleForm from '../components/single-form.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row additional-info-container";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    var header = "";
    if (this.props.test && this.props.test.indexOf("donate-by") !== -1 && /^(en)(\b|$)/.test(this.context.intl.locale)) {
      header = "Donate by 12/31";
    }
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="heart-image icon-baseline" height="100" width="107" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
            <img className="heart-image icon-variant" height="100" width="107" src="/assets/images/pixel-heart.svg"/>
            <div>
              <img className="mozilla-watermark" src="/assets/images/mozilla.5e83dba715a0469b92071758876f0373.svg"/>
              <span>{this.context.intl.formatMessage({id: 'additional_info'})}</span>
            </div>
          </div>
          <SingleForm
            currency={this.props.currency}
            presets={this.props.presets}
            amount={this.props.amount}
            frequency={this.props.frequency}
            country={this.props.country}
            header={header}
          />
        </div>
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  }
});
