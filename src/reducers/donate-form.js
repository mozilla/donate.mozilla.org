import currencyData from '../data/currencies.js';
import assign from 'object-assign';

const initialState = {
  frequency: 'single',
  nextmonth: false,
  amount: '',
  presets: currencyData.usd.presets.single,
  currency: currencyData.usd,
  amountError: ''
};

const donateApp = (state = initialState, action) => {
  var presets;
  var position;
  var amount;
  switch (action.type) {
  case 'SET_FREQUENCY':
    presets = currencyData[state.currency.code].presets[action.data];
    position = state.presets.indexOf(state.amount);
    amount = state.amount;
    if (position !== -1) {
      amount = presets[position];
    }
    return assign({}, state, {
      frequency: action.data,
      presets: presets,
      amount: amount,
      amountError: ''
    });
  case 'SET_NEXTMONTH':
    return assign({}, state, {
      nextmonth: action.data
    });
  case 'SET_AMOUNT':
    return assign({}, state, {
      amount: action.data,
      amountError: ''
    });
  case 'SET_AMOUNT_ERROR':
    return assign({}, state, {
      amountError: action.data
    });
  case 'SET_CURRENCY':
    return assign({}, state, {
      currency: action.data,
      presets: currencyData[action.data.code].presets[state.frequency],
      amount: '',
      amountError: ''
    });
  default:
    return state;
  }
};

export default donateApp;
