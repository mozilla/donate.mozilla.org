var throng = require('throng');
var donateServer = require('./server');
var workers = process.env.WEB_CONCURRENCY || 1;

async function start() {
  var server = await donateServer();

  await server.start();
  server.log('info', 'Running server at: ' + server.info.uri);

  var shutdown = async() => {
    // instruct hapi to stop accepting incoming requests, and to
    // wait fifteen seconds before forcefully terminating existing connections.
    // We do this so that we don't interrupt in-flight and queued requests
    await server.stop({
      timeout: 15000
    });

    // wait fifteen seconds before terminating the process (to allow for the existing request timeout to run it's course)
    setTimeout(() => {
      process.exit(0);
    }, 15000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// function start() {
//   runWorker();
// }

// lol @ Infinity actually being used for something meaningful
throng({
  start: start,
  workers,
  lifetime: Infinity
});
