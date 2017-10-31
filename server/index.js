require('habitat').load();

var Hapi = require('hapi');
var Joi = require('joi');

var polyfillio = require('polyfill-service');
var PolyfillSet = require('./scripts/PolyfillSet.js');
var getLocale = require('../dist/lib/get-locale.js');


var exchangeRates = require('../assets/exchange-rates/latest.json');
var currencyFor = require('./lib/currency-for.js');
var getServerOptions = require('./get-server-options');
var baseRoutes = require('./base-routes');
var services = require('./services');
var finalizeServer = require('./finalise-server');

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

  server.route(baseRoutes);

  server.register(services, function(err) {
    finalizeServer(err, server);
  });

  return server;
};
