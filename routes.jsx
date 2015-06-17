var React = require('react');
var Route = require('react-router').Route;

var routes = (
  <Route>
    <Route name="thank-you" path="/thank-you/?" handler={require('./pages/thank-you.jsx')} />
    <Route name="sequential" path="/?" handler={require('./pages/sequential.jsx')} />
    <Route name="share" path="/share/?" handler={require('./pages/share.jsx')} />
    <Route name="paypal-donate-usd" path="/paypal-donate-usd/?" handler={require('./pages/paypal-donate-usd.jsx')} />
    <Route name="paypal-donate-twd" path="/paypal-donate-twd/?" handler={require('./pages/paypal-donate-twd.jsx')} />
    <Route name="paypal-donate-thb" path="/paypal-donate-thb/?" handler={require('./pages/paypal-donate-thb.jsx')} />
    <Route name="paypal-donate-sek" path="/paypal-donate-sek/?" handler={require('./pages/paypal-donate-sek.jsx')} />
    <Route name="paypal-donate-rub" path="/paypal-donate-rub/?" handler={require('./pages/paypal-donate-rub.jsx')} />
    <Route name="paypal-donate-pln" path="/paypal-donate-pln/?" handler={require('./pages/paypal-donate-pln.jsx')} />
    <Route name="paypal-donate-php" path="/paypal-donate-php/?" handler={require('./pages/paypal-donate-php.jsx')} />
  </Route>
);

module.exports = routes;
