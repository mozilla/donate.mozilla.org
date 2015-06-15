var React = require('react');
var Route = require('react-router').Route;

var routes = (
  <Route>
    <Route name="thank-you" path="/thank-you" handler={require('./pages/thank-you.jsx')} />
    <Route name="sequential" path="/" handler={require('./pages/sequential.jsx')} />
  </Route>
);

module.exports = routes;
