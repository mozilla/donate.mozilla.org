var React = require('react');
var Route = require('react-router').Route;
var paths = require('./paths.js');
var currencies = require('./currencies.js').paths;
var pathsArray = Object.keys(paths).concat(currencies);

var routes = (
  <Route>
    {
      Object.keys(paths).map(function(key) {
        return (
          <Route key={key} name={paths[key].name} handler={paths[key].handler} path={paths[key].path} />
        );
      })
    }
    <Route name="paypal-donate" path="/paypal-donate-:currency/?" handler={require('./pages/paypal-donate.jsx')} />
  </Route>
);

module.exports = {
  paths: pathsArray,
  routes: routes
};
