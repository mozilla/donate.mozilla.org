var React = require('react');
var Link = require('../components/link.jsx');

var ThankYou = React.createClass({
  render: function() {
    return (
      <div>
        <Link to="thank-you">thank you</Link>
      </div>
    );
  }
});

module.exports = ThankYou;
