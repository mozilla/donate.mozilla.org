var React = require('react'),
    Router = require('react-router');
var currencies = require('./currencies.js').currencies;

var routes = require("./routes.jsx").routes;

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler {...currencies[state.params.currency]}/>, document.querySelector("#my-app"));
});
