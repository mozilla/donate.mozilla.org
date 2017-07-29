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
    var aboutCopy = (<span>{this.context.intl.formatMessage({id: 'additional_info'})}</span>);
    if (this.props.test === "nnsnippet1707") {
      aboutCopy = (<span>is a global nonprofit that stands up for an open and healthy Internet, where telecom companies are not allowed to censor or throttle your access to the web based on the content you want to see. Will you give today?</span>);
    }
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="heart-image icon-baseline" height="100" width="107" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
            <img className="heart-image icon-variant" height="100" width="107" src="/assets/images/pixel-heart.svg"/>
            <div>
              <img className="mozilla-watermark" src="/assets/images/mozilla.1068965acefde994a71c187d253aca2b.svg"/>
              {aboutCopy}
            </div>
          </div>
          <SingleForm
            currency={this.props.currency}
            presets={this.props.presets}
            amount={this.props.amount}
            frequency={this.props.frequency}
            country={this.props.country}
          />
        </div>
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  }
});
