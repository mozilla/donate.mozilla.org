var Path = require('path');
var fs = require('fs');
var Habitat = require('habitat');
Habitat.load();
var env = new Habitat();

module.exports = function(securityConfig) {
  var fileHashes;
  var prod = env.get('NPM_CONFIG_PRODUCTION');

  if (prod) {
    fileHashes = require(Path.join(__dirname, 'public', 'webpack-assets.json'));
    return [{
      method: 'GET',
      path: '/main.js',
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'public', fileHashes.main.js));
      },
      config: {
        security: securityConfig
      }
    },{
      method: 'GET',
      path: '/style.css',
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'public', fileHashes.main.css));
      },
      config: {
        security: securityConfig
      }
    },{
      method: 'GET',
      path: '/main.{id}.js',
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'public', fileHashes.main.js));
      },
      config: {
        security: securityConfig
      }
    },{
      method: 'GET',
      path: '/style.{id}.css',
      handler: function(request, reply) {
        reply.file(Path.join(__dirname, 'public', fileHashes.main.css));
      },
      config: {
        security: securityConfig
      }
    }];
  }
  return [
    {
      method: 'GET',
      path: '/main.js',
      handler: function(request, reply) {
        var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '..', 'public/webpack-assets.json')));
        var filename = Path.join(__dirname, '../public', fileHashes.main.js);
        reply.file(filename);
      },
      config: {
        security: securityConfig
      }
    },{
      method: 'GET',
      path: '/style.css',
      handler: function(request, reply) {
        var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '..', 'public/webpack-assets.json')));
        reply.file(Path.join(__dirname, '../public', fileHashes.main.css));
      },
      config: {
        security: securityConfig
      }
    },{
      method: 'GET',
      path: '/main.{id}.js',
      handler: function(request, reply) {
        var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '..', 'public/webpack-assets.json')));
        reply.file(Path.join(__dirname, '../public', fileHashes.main.js));
      },
      config: {
        security: securityConfig
      }
    },{
      method: 'GET',
      path: '/style.{id}.css',
      handler: function(request, reply) {
        var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '..', 'public/webpack-assets.json')));
        reply.file(Path.join(__dirname, '../public', fileHashes.main.css));
      },
      config: {
        security: securityConfig
      }
    }
  ];
};
