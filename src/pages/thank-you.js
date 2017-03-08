import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Signup from '../components/signup.js';
import Social from '../components/social.js';
import ThankYouHeader from '../components/thank-you-header.js';
import analytics from '../lib/analytics.js';
import form from '../lib/form.js';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row thank-you-page";
    var signUpOrSocial = (<Social/>);
    if (/^(en|de)(\b|$)/.test(this.context.intl.locale)) {
      signUpOrSocial = (<Signup country={this.props.country} email={this.props.email}/>);
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
