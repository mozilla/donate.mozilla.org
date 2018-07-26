const Habitat = require('habitat');
Habitat.load();
const env = new Habitat();

const url = require('url');
const Hapi = require('hapi');
const AuthBearer = require('hapi-auth-bearer-token');
const locales = require('./locales');
const reactRouted = require('../dist/lib/react-server-route.js')(locales);
const getServerOptions = require('./get-server-options');
const baseRoutes = require('./base-routes');
const services = require('./services');
const finalizeServer = require('./finalise-server');

const ONE_HOUR_MS = 1000 * 60 * 60;
const appHost = url.parse(env.get(`APPLICATION_URI`)).host;

module.exports = async function(options) {
  const serverOptions = getServerOptions(options);
  const server = new Hapi.Server(serverOptions);

  await server.register(AuthBearer);

  server.auth.strategy("stripe", "bearer-access-token", {
    allowQueryToken: true,
    validate: async(request, token, h) => {
      const isValid = token === env.get(`STRIPE_WEBHOOK_SECRET`);
      const credentials = { token: token };
      return { isValid, credentials };
    }
  });

  server.state("session", {
    ttl: ONE_HOUR_MS,
    isSecure: env.get(`NODE_ENV`) === "production",
    encoding: "none"
  });

  server.route(baseRoutes);

  if (env.get(`ENFORCE_HOSTNAME`)) {
    server.ext('onRequest', (request, h) => {
      let {host} = request.info;

      if (appHost === host) {
        return h.continue;
      }

      let parsed = url.parse(request.url.href, false);
      let newURL = url.format({
        protocol: parsed.protocol,
        host: appHost,
        pathname: parsed.path
      });

      return h.response().takeover().redirect(newURL);
    });
  }

  await server.register(services);

  finalizeServer(server, reactRouted);

  return server;
};
