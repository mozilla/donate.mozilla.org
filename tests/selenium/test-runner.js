module.exports = function() {
  var tests = [];
  function next() {
    var test = tests[0] || function() {};
    test(function() {
      tests.shift();
      next();
    });
  }
  return {
    run: function(test) {
      tests.push(test);
      if (test.length === 1) {
        next();
      }
    }
  };
}();
