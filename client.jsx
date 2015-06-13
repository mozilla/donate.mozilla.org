var React = require('react'),
    Router = require('react-router');

var routes = require("./routes.jsx");

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.querySelector("#my-app"));
});
