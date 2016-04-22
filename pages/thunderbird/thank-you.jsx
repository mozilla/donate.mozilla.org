// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import Social from '../../components/thunderbird/social.jsx';
import ThunderbirdFooter from '../../components/thunderbird/footer.jsx';
import Signup from '../../components/thunderbird/signup.jsx';
import ThankYouHeader from '../../components/thunderbird/thank-you-header.jsx';
import analytics from '../../assets/js/analytics.js';
import form from '../../scripts/form.js';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row thank-you-page thunderbird";
    var signUpOrSocial = (<Social/>);
    if (this.props.params && /^(en)(\b|$)/.test(this.context.intl.locale)) {
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
            <ThunderbirdFooter/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
