import React from 'react';
import MozillaFooter from '../../components/mozilla/footer.jsx';
import ThankYouHeader from '../../components/thank-you-header.jsx';
import SignUpOrSocial from '../../components/signup-or-social.jsx';
import ThankYouPage from '../thank-you.jsx';

var MozillaThankYou = React.createClass({
  propTypes: {
    email: React.PropTypes.string,
    country: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <ThankYouPage {...this.props}>
        <ThankYouHeader/>
        <div>
          <SignUpOrSocial
            supportedLocales={["en", "de"]}
            country={this.props.country}
            email={this.props.email}
          />
          <MozillaFooter/>
        </div>
      </ThankYouPage>
    );
  }
});

module.exports = MozillaThankYou;
