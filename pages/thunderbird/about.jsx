import React from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.jsx';
import SmallPrint from '../../components/thunderbird/small-print.jsx';
import SingleForm from '../../components/single-form.jsx';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row additional-info-container thunderbird";
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="internet-graphic" width="224" src="/assets/images/thunderbird/thunderbird-logo-wordmark-small.png"/>
            <div>{this.context.intl.formatMessage({id: 'additional_info_thunderbird'})}</div>
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
