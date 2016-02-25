import React from 'react';
import Footer from '../../components/footer.jsx';
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
            <img className="internet-graphic" height="100" width="107" src="/assets/images/thunderbird-logo.png"/>
            <div>
              We're the leading open source cross-platform email and calendaring client, free for business and personal use. By donating you'll help ensure it stays that way and contribute towards future development. Will you give today?
            </div>
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
        <Footer/>
      </div>
    );
  }
});
