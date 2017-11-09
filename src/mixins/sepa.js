import React from 'react';
import reactGA from 'react-ga';

import { browserHistory } from 'react-router'

var SEPAMixin = {
  contextTypes: {
    intl: React.PropTypes.object
  },
  sepaCheckout: function(props) {
    // redirect users to the dedicated SEPA payment page
    browserHistory.push('/sepa');
  }
};

module.exports = SEPAMixin;
