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
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="heart-image" height="37" width="253" src="/assets/images/glassroom-logo-new.svg"/>
            <div>
              <span>Mozilla works with partners like Tactical Technology Collective to educate people about internet health issues. Your donations help support our efforts to produce more projects and events like The Glass Room. Thank you for your support!</span>
            </div>
          </div>
          <SingleForm
            appName="glassroomnyc"
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
