var rates = require('../../assets/exchange-rates/latest.json');

module.exports = function() {
  var queryString = decodeURIComponent(window.location.search);
  var tx = null; // transaction id
  var amt = null;
  var cc = null; // currency code
  var frq = null; // frequency
  var product_name = null;
  var product_category = 'one-time';

  // Search for PayPal Params
  var pp_tx_re = /tx=(\w+)/;
  var pp_amt_re = /amt=([\w.]+)/;
  var pp_cc_re = /cc=(\w+)/;
  var pp_frequency_re = /frequency=(\w+)/;
  if (pp_tx_re.test(queryString) && pp_amt_re.test(queryString) && pp_cc_re.test(queryString)) {
    tx = queryString.match(pp_tx_re)[1];
    amt = queryString.match(pp_amt_re)[1];
    cc = queryString.match(pp_cc_re)[1];
    product_name = 'PayPal Donation';

    // check for monthly donations
    if (pp_frequency_re.test(queryString)) {
      frq = queryString.match(pp_frequency_re)[1];
      if (frq === 'monthly') {
        product_category = 'monthly';
      }
    }
  }

  // Search for Coinbase Params
  var cb_tx_re = /order\[transaction\]\[id\]=(\w+)/;
  var cb_amt_re = /order\[total_native\]\[cents\]=([\w.]+)/;
  var cb_cc_re = /order\[total_payout\]\[currency_iso\]=(\w+)/;
  if (cb_tx_re.test(queryString) && cb_amt_re.test(queryString) && cb_cc_re.test(queryString)) {
    tx = queryString.match(cb_tx_re)[1];
    amt = queryString.match(cb_amt_re)[1] / 100; // coinbase amount in cents
    cc = queryString.match(cb_cc_re)[1];
    product_name = 'Bitcoin Donation';
  }

  // Search for Stripe Params
  var str_tx_re = /str_id=(\w+)/;
  var str_amt_re = /str_amount=([\w.]+)/;
  var str_cc_re = /str_currency=(\w+)/;
  var str_frequency_re = /str_frequency=(\w+)/;
  if (str_tx_re.test(queryString) && str_amt_re.test(queryString) && str_cc_re.test(queryString)) {
    tx = queryString.match(str_tx_re)[1];
    amt = queryString.match(str_amt_re)[1] / 100; // Stripe amount in cents;
    cc = queryString.match(str_cc_re)[1];
    product_name = 'Stripe Donation';

    // check for monthly donations
    if (str_frequency_re.test(queryString)) {
      frq = queryString.match(str_frequency_re)[1];
      if (frq === 'monthly') {
        product_category = 'monthly';
      }
    }
  }

  // increase analytics value of monthly gifts
  if (product_category === 'monthly') {
    // estimate based on YR1 value
    amt = amt * 12;
  }

  // 2 DP
  function toTwoDP(i) {
    return Math.round(i * 100) / 100;
  }

  if (tx && amt && cc) {

    let exchangeRate = 1;
    let amtUSD = amt;

    if (cc !== 'USD' && rates.rates[cc]) {
      exchangeRate = rates.rates[cc];
      amtUSD = toTwoDP(amt / exchangeRate);
    }

    // Filter out impact of major gifts on conversion analysis
    // otherwise transactions can skew the average too far
    if (amtUSD > 1000) {
      amtUSD = 1000;
      amt = toTwoDP(1000 / exchangeRate);
    }

    if (window.ga) {

      let ga = window.ga;

      // We're using universal analytics ecommerce tracking
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce
      ga('require', 'ecommerce');

      ga('ecommerce:addTransaction', {
        'id': tx,
        'affiliation': 'Donations',
        'revenue': amt,
        'shipping': '0',
        'tax': '0',
        'currency': cc
      });

      ga('ecommerce:addItem', {
        'id': tx,
        'name': product_name,
        'sku': product_name,
        'category': product_category,
        'price': amt,
        'quantity': '1'
      });

      //submit transaction to the Analytics servers
      ga('ecommerce:send');

    }
  }
};
