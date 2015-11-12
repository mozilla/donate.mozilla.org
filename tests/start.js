var server = require('../server')();

server.start(function() {
  server.stop(function() {});
});
