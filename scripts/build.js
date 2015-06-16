var spawn = require('cross-spawn');
var Habitat = require('habitat');

Habitat.load();

var env = new Habitat();
var buildCommand = 'start:dev';

if (env.get("NPM_CONFIG_PRODUCTION")) {
  buildCommand = 'start:prod';
}

var npm = spawn('npm', ['run', buildCommand]);

npm.stdout.on('data', function(data) {
  console.log( data.toString() );
});

npm.stderr.on('data', function (data) {
  console.log( data.toString() );
});

npm.on('close', function(code) {
  process.exit(code);
});
