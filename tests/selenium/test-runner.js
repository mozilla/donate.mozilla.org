var server = require('../../server');

module.exports = function(tests) {
  return {
    start: function(done) {
      var current = 0;
      function next() {
        run(current + 1);
      }
      function run(index) {
        current = index;
        if (!tests[current]) {
          server.stop(done);
        } else {
          tests[current].start(next);
        }
      }
      server.start(function() {
        run(current);
      });
    }
  };
};
