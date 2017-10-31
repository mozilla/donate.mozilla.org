module.exports = function getServerOptions(options) {
  options = options || {};

  return {
    connections: {
      routes: {
        security: {
          hsts: {
            maxAge: 15768000,
            includeSubDomains: true,
            preload: true
          },
          xframe: process.env.ENABLE_XFRAMEOPTIONS === 'true',
          xss: true,
          noOpen: true,
          noSniff: true
        }
      }
    },
    useDomains: !!options.useDomains
  };
};
