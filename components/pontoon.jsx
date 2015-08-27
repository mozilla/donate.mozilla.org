import React from 'react';

var production = process.env.ENABLE_PONTOON === 'false' ? false : true;

var Pontoon = React.createClass({
  render: function() {
    if (!production) {
      return (
        <script src='https://pontoon.mozilla.org/pontoon.js'></script>
      )
    } else {
      return null;
    }
  }
});

module.exports = Pontoon;
