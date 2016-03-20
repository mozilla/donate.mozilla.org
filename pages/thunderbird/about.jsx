import React from 'react';
import ThunderbirdFooter from '../../components/footer-thunderbird.jsx';
import SmallPrint from '../../components/small-print-thunderbird.jsx';
import SingleForm from '../../components/single-form.jsx';

var About = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    country: React.PropTypes.string.isRequired,
    currency: React.PropTypes.object.isRequired,
    amount: React.PropTypes.string.isRequired,
    presets: React.PropTypes.array.isRequired,
    test: React.PropTypes.string,
    frequency: React.PropTypes.string.isRequired
  },
  render: function() {
    var className = "row additional-info-container thunderbird";
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="internet-graphic" width="224" src="/assets/images/thunderbird/thunderbird-logo-wordmark-small.png"/>
            <div>{this.context.formatMessage({id: 'additional_info_thunderbird'})}</div>
          </div>
          <SingleForm
            appName="thunderbird"
            currency={this.props.currency}
            presets={this.props.presets}
            amount={this.props.amount}
            frequency={this.props.frequency}
            country={this.props.country}
          />
        </div>
        <SmallPrint stripeNotice={true} />
        <ThunderbirdFooter/>
      </div>
    );
  }
});

module.exports = About;
