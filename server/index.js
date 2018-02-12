require('habitat').load();

var Hapi = require('hapi');
var locales = require('./locales');
var reactRouted = require('../dist/lib/react-server-route.js')(locales);
var getServerOptions = require('./get-server-options');
var baseRoutes = require('./base-routes');
var services = require('./services');
var finalizeServer = require('./finalise-server');

const ONE_HOUR_MS = 1000 * 60 * 60;


module.exports = function(options) {
  var serverOptions = getServerOptions(options);
  var server = new Hapi.Server(serverOptions);

  server.connection({
    host: process.env.HOST,
    port: process.env.PORT,
    uri: process.env.APPLICATION_URI
  });

  server.register(require("hapi-auth-bearer-token"), function(err) {
    if (err) {
      throw err;
    }
  });

  server.auth.strategy("stripe", "bearer-access-token", {
    validateFunc: function(token, callback) {
      callback(null, token === process.env.STRIPE_WEBHOOK_SECRET, { token: token });
    }
  });

  server.state("session", {
    ttl: ONE_HOUR_MS,
    isSecure: process.env.NODE_ENV === "production",
    encoding: "none"
  });

  server.route(baseRoutes);

  server.register(services, function(err) {
    finalizeServer(err, server, reactRouted);
  });

  return server;
};
