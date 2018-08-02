require('habitat').load();

const Hapi = require('hapi');
const AuthBearer = require('hapi-auth-bearer-token');
const locales = require('./locales');
const reactRouted = require('../dist/lib/react-server-route.js')(locales);
const getServerOptions = require('./get-server-options');
const baseRoutes = require('./base-routes');
const services = require('./services');
const finalizeServer = require('./finalise-server');

const ONE_HOUR_MS = 1000 * 60 * 60;

module.exports = async function(options) {
  const serverOptions = getServerOptions(options);
  const server = new Hapi.Server(serverOptions);

  await server.register(AuthBearer);

  server.auth.strategy("stripe", "bearer-access-token", {
    allowQueryToken: true,
    validate: async(request, token, h) => {
      const isValid = token === process.env.STRIPE_WEBHOOK_SECRET;
      const credentials = { token: token };
      return { isValid, credentials };
    }
  });

  server.state("session", {
    ttl: ONE_HOUR_MS,
    isSecure: process.env.NODE_ENV === "production",
    encoding: "none"
  });

  server.route(baseRoutes);

  await server.register(services);

  finalizeServer(server, reactRouted);

  return server;
};
