var throng = require('throng');
var donateServer = require('./server');
var workers = process.env.WEB_CONCURRENCY || 1;

function start() {
  var server = donateServer();

  server.start(function() {
    server.log('info', 'Running server at: ' + server.info.uri);
  });

  var shutdown = () => {
    server.stop(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// lol @ Infinity actually being used for something meaningful
throng(workers, start);
