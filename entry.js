var React = require('react');
var Router = require('react-router');
var routes = require('./routes.jsx');

if (typeof global.window !== 'undefined') {
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(React.createFactory(Handler)(), document.querySelector("#my-app"));
  });
} else {
  module.exports = function render(locals, callback) {
    Router.run(routes, locals.path, function (Handler) {
      var Index = React.createFactory(require('./pages/index.jsx'));
      var Page = React.createFactory(Handler);
      callback(null, React.renderToString(Index({
        markup: React.renderToString(Page())
      })));
    });
  }
}
