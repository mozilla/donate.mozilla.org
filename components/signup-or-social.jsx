import React from 'react';
import Signup from './signup.jsx';
import Social from './social.jsx';

var SignupOrSocial = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    email: React.PropTypes.string,
    supportedLocales: React.PropTypes.array.isRequired,
    country: React.PropTypes.string.isRequired
  },
  render: function() {
    var locale = this.context.intl.locale;
    var signUpOrSocial = (<Social/>);
    var supportedLocalesRegex = new RegExp("^(" + this.props.supportedLocales.join("|") + ")(\\b|$)");
    if (supportedLocalesRegex.test(locale)) {
      signUpOrSocial = (<Signup country={this.props.country} email={this.props.email}/>);
    }
    return (
      <div>
        {signUpOrSocial}
      </div>
    );
  }
});

module.exports = SignupOrSocial;
