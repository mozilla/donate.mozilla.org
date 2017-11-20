import React from 'react';
//import reactGA from 'react-ga'; // TODO: we want some sensible analytics here

var SEPAMixin = {
  contextTypes: {
    intl: React.PropTypes.object
  },
  sepaCheckout: function(props) {
    // redirect users to the dedicated SEPA payment page.
    // Note: this relies on window.location, which is not
    // necessarily the best way to effect a redirect in a
    // way that lets us perform analytics.
    if (typeof window !== "undefined" && window.location) {
      window.location = 'sepa';
    }
  }
};

module.exports = SEPAMixin;
