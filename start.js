var throng = require('throng');
var donateServer = require('./server');
var workers = process.env.WEB_CONCURRENCY || 1;

function start() {
  var server = donateServer();

  server.start(function() {
    server.log('info', 'Running server at: ' + server.info.uri);
  });

  var shutdown = () => {
    server.stop({
      timeout: 15000 // wait fifteen seconds before forcefully terminating existing connections
    },() => {
      setTimeout(() => {
        process.exit(0);
      }, 15000);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// lol @ Infinity actually being used for something meaningful
throng(start, {
  workers,
  lifetime: Infinity
});
