var server = require('./server');

server.start();

var shutdown = () => {
  server.stop(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
