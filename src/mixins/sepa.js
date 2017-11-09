import React from 'react';
import reactGA from 'react-ga';

import { browserHistory } from 'react-router'

var SEPAMixin = {
  contextTypes: {
    intl: React.PropTypes.object,
    location: React.PropTypes.object
  },
  sepaCheckout: function(props) {
    // redirect users to the dedicated SEPA payment page
    location = 'sepa';
  }
};

module.exports = SEPAMixin;
