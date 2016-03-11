// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import ThunderbirdFooter from '../../components/footer-thunderbird.jsx';
import Signup from '../../components/signup-thunderbird.jsx';
import ThankYouHeader from '../../components/thank-you-header-thunderbird.jsx';
import analytics from '../../assets/js/analytics.js';
import form from '../../scripts/form.js';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    email: React.PropTypes.string,
    test: React.PropTypes.string,
    country: React.PropTypes.string.isRequired
  },
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row thank-you-page thunderbird";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className={className}>
          <ThankYouHeader/>
          <div>
            <Signup country={this.props.country} email={this.props.email} />
            <ThunderbirdFooter/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
