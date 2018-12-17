import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Nav from '../components/nav.js';
import SingleForm from '../components/single-form.js';
import { FormattedHTMLMessage } from 'react-intl';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    var aboutCopy = (<span><FormattedHTMLMessage id="additional_info_internet_health_bold"/></span>);
    var test = this.props.test;

    // Run our copy test only on English locale:
    if (test && test.indexOf('nst') > -1 && this.context.intl.locale === "en-US") {
      // New Side Text copy from ./locales/en-US/messages.properties
      aboutCopy = (<span><FormattedHTMLMessage id="updated_additional_info_internet_health_bold"/></span>);
    }

    return {
      aboutCopy: aboutCopy
    };
  },
  renderTextAboutPage: function() {
    return (
      <div className="container additional-page">
        <picture>
          <source width="1448" srcSet="/assets/images/homepage-images/teacher-wide.jpg" media="(max-width: 799px)" />
          <img className="homepage-image" src="/assets/images/homepage-images/teacher-full.jpg" alt="Man pointing at student's computer screen"/>
        </picture>
        <div>
          { this.state.aboutCopy }
        </div>
      </div>
    );
  },
  renderNav: function() {
    return (
      <Nav zenMode={true} simpleBackground={true}/>
    );
  },
  render: function() {
    var className = "row additional-info-container";

    var additionalInfo = this.renderTextAboutPage();

    return (
      <div>
        {this.renderNav()}
        <div className={className}>
          <div className="additional-info-page">
            { additionalInfo }
            <SingleForm
              test={this.props.test}
              subscribed={this.props.subscribed}
              currency={this.props.currency}
              presets={this.props.presets}
              amount={this.props.amount}
              frequency={this.props.frequency}
              country={this.props.country}
            />
          </div>
          <MozillaFooter/>
        </div>
      </div>
    );
  }
});
