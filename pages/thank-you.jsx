// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import MozillaFooter from '../components/mozilla/footer.jsx';
import Signup from '../components/signup.jsx';
import Social from '../components/social.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';
import { IntlMixin } from 'react-intl';
import analytics from '../assets/js/analytics.js';
import form from '../scripts/form.js';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row thank-you-page";
    var locale = this.props.locales[0];
    var signUpOrSocial = (<Social language={locale}/>);
    if (this.props.params && /^(en|de)(\b|$)/.test(locale)) {
      signUpOrSocial = (<Signup country={this.props.country} email={this.props.email} locales={this.props.locales} />);
    }
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className={className}>
          <ThankYouHeader/>
          <div>
            {signUpOrSocial}
            <MozillaFooter/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
