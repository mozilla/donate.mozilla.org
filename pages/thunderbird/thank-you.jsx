// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import ThunderbirdFooter from '../../components/footer-thunderbird.jsx';
import Signup from '../../components/signup-thunderbird.jsx';
import ThankYouHeader from '../../components/thank-you-header-thunderbird.jsx';
import { IntlMixin } from 'react-intl';
import analytics from '../../assets/js/analytics.js';
import form from '../../scripts/form.js';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
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
