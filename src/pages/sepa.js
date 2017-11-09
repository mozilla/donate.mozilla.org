import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SmallPrint from '../components/small-print.js';

import { CardElement } from 'react-stripe-elements';

/**
 * SEPA payment page, kept as dedicated page to allow
 * for high levels of security control through CSP etc.
 */
var SEPA = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div className={'row'}>
        <Header alt={this.context.intl.formatMessage({id: 'donate_to_mozilla'})}></Header>
        <div>
          <h2>SEPA PAYMENT PAGE</h2>
          
          <CardElement style={{base: {fontSize: '18px'}}} />
        </div>
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = SEPA;
