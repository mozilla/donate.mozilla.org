var React = require('react');
var Route = require('react-router').Route;

var routes = (
  <Route>
    <Route name="thank-you" path="/thank-you" handler={require('./pages/thank-you.jsx')} />
    <Route name="thank-you-too" path="/thank-you-too" handler={require('./pages/thank-you-too.jsx')} />
  </Route>
);

module.exports = routes;
