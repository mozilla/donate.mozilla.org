import React from 'react';

var optimizelyID = process.env.OPTIMIZELY_ID || '206878104';
var optimizelyActive = process.env.OPTIMIZELY_ACTIVE || 'yes';
var cookieDomain = process.env.FULL_SUBDOMAIN_FOR_COOKIE || 'donate.mozilla.org';

var optimizelyURL = 'https://cdn.optimizely.com/js/' + optimizelyID + '.js';

var OptimizelySubdomain = React.createClass({
  render: function() {
    if (optimizelyActive === 'yes') {
      return (
        <script>
          window['optimizely'] = window['optimizely'] || [];
          window['optimizely'].push(["setCookieDomain", {cookieDomain}]);
        </script>
      )
    }
  }
});

var Optimizely = React.createClass({
  render: function() {
    if (optimizelyActive === 'yes') {
      return (
        <script src={optimizelyURL}></script>
      )
    }
  }
});

module.exports = Optimizely;
