var React = require('react');
var Route = require('react-router').Route;
var currencies = require('./currencies.js');

var routes = (
  <Route>
    <Route name="thank-you" path="/thank-you/?" handler={require('./pages/thank-you.jsx')} />
    <Route name="sequential" path="/?" handler={require('./pages/sequential.jsx')} />
    <Route name="share" path="/share/?" handler={require('./pages/share.jsx')} />
    {
      currencies.map(function(value) {
        var currencyName = value.currency.toLowerCase();
        return (
          <Route
            name={"paypal-donate-" + currencyName}
            path={"/paypal-donate-" + currencyName + "/?"}
            handler={react.createElement(require('./pages/paypal-donate.jsx'), value)}
          />
        );
      })
    }
  </Route>
);

module.exports = routes;
