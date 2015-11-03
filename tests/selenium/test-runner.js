module.exports = function(tests) {
  function next() {
    if (tests.length) {
      tests.shift()(next);
    }
  }
  next();
};
