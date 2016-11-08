/*eslint no-unreachable: 0*/
// Make console.warn throw

var warn = console.warn;
console.warn = function(warning) {
  throw new Error(warning);
  warn.apply(console, arguments);
};

require('./name-input.tests.jsx');
require('./address-input.tests.jsx');
require('./amount-buttons.tests.jsx');
require('./currency-dropdown.tests.jsx');
require('./donation-props.tests.jsx');
require('../lib/location-parser.tests.js');
require('../lib/queryParser.tests.js');
require('../lib/amount-modifier.tests.js');
require('../lib/paypal-micro.tests.js');
