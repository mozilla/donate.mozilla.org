import React from 'react';
import reactGA from 'react-ga';
import MozillaFooter from '../components/mozilla/footer.js';
import SmallPrint from '../components/small-print.js';
import SingleForm from '../components/single-form.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      aboutCopy: null
    };
  },
  componentDidMount: function() {
    var additionalInfoId = 'additional_info';
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      additionalInfoId = 'additional_info_internet_health';
    }
    var aboutCopy = (<span>{this.context.intl.formatMessage({id: additionalInfoId})}</span>);

    this.setState({
      aboutCopy: aboutCopy
    });
  },
  renderTextAboutPage: function() {
    return (
      <div className="container additional-page">
        <img className="heart-image icon-baseline" height="100" width="107" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
        <img className="heart-image icon-variant" height="100" width="107" src="/assets/images/pixel-heart.svg"/>
        <div>
          <img className="mozilla-watermark" src="/assets/images/mozilla.1068965acefde994a71c187d253aca2b.svg"/>
          { this.state.aboutCopy }
        </div>
      </div>
    );
  },
  render: function() {
    var className = "row additional-info-container";

    var additionalInfo = this.renderTextAboutPage();

    return (
      <div className={className}>
        <div className="additional-info-page">
          { additionalInfo }
          <SingleForm
            subscribed={this.props.subscribed}
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
