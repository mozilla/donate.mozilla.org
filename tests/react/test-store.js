import reducer from '../../src/reducers';
import { createStore } from 'redux';
import currencyData from '../../src/data/currencies.js';

var testStore = function(props) {
  props = props || {};
  return createStore(reducer, {
    donateForm: {
      currency: props.currency || currencyData.usd,
      frequency: props.frequency || "single",
      presets: props.presets || currencyData.usd.presets.single,
      amount: props.amount || ""
    }
  });
};

module.exports = testStore;
