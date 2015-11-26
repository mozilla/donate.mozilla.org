/*eslint no-unreachable: 0*/
// Make console.warn throw
var warn = console.warn;
console.warn = function(warning) {
  throw new Error(warning);
  warn.apply(console, arguments);
};

require('./name-input.tests.jsx');
require('./address-input.tests.jsx');
require('./credit-card-info.tests.jsx');
require('./amount-buttons.tests.jsx');
require('./currency-dropdown.tests.jsx');
require('./sequential-props.tests.jsx');
require('../lib/queryParser.tests.js');
require('../lib/amount-modifier.tests.js');
