function SimpleHtmlPrecompiler(paths, build) {
  this.paths = paths;
  this.build = build;
}

SimpleHtmlPrecompiler.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('after-emit', function(compiler, done) {
    self.paths.map(function(outputPath) {
      self.build(outputPath, function(html) {});
    });
    done();
  });
};

module.exports = SimpleHtmlPrecompiler;
