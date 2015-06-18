var path = require('path');

function SimpleHtmlPrecompiler(paths, build) {
  this.paths = paths;
  this.build = build;
}

SimpleHtmlPrecompiler.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, done) {
    self.paths.map(function(outputPath) {
      self.build(outputPath, function(html) {
        compiler.assets[path.join(outputPath, '/index.html')] = {
          source: function() {
            return html;
          },
          size: function() {
            return html.length;
          }
        };
      });
    });
    done();
  });
}
module.exports = SimpleHtmlPrecompiler;
