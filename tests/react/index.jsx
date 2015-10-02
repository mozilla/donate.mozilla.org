/*eslint no-unreachable: 0*/
// Make console.warn throw
var warn = console.warn;
console.warn = function (warning) {
  throw new Error(warning);
  warn.apply(console, arguments);
};

require('./name-input.tests.jsx');
require('./address-input.tests.jsx');
require('./credit-card-info.tests.jsx');
