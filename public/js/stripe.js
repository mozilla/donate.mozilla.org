Stripe.setPublishableKey('pk_test_BZ0QTIwe7BVAk1ZDxOgWZ9Z6');

(function() {
  var queryString = decodeURIComponent(window.location.search);
  var tx = null;
  var amt = null;
  var cc = null;
  var product_name = null;

  // Search for PayPal Params
  var pp_tx_re = /tx=(\w+)/;
  var pp_amt_re = /amt=([\w\.]+)/;
  var pp_cc_re = /cc=(\w+)/;
  if (pp_tx_re.test(queryString) && pp_amt_re.test(queryString) && pp_cc_re.test(queryString)) {
    tx = queryString.match(pp_tx_re)[1];
    amt = queryString.match(pp_amt_re)[1];
    cc = queryString.match(pp_cc_re)[1];
    product_name = 'PayPal Donation';
  }
  // Search for Coinbase Params
  var cb_tx_re = /order\[transaction\]\[id\]=(\w+)/;
  var cb_amt_re = /order\[total_native\]\[cents\]=([\w\.]+)/;
  var cb_cc_re = /order\[total_payout\]\[currency_iso\]=(\w+)/;
  if (cb_tx_re.test(queryString) && cb_amt_re.test(queryString) && cb_cc_re.test(queryString)) {
    tx = queryString.match(cb_tx_re)[1];
    amt = queryString.match(cb_amt_re)[1] / 100; // coinbase amount in cents
    cc = queryString.match(cb_cc_re)[1];
    product_name = 'Bitcoin Donation';
  }

  if (tx && amt && cc) {
    window.optimizely = window.optimizely || [];
    window.optimizely.push(['trackEvent', 'donation', {
      'revenue': amt * 100
    }]);
    _gaq.push(['_set', 'currencyCode', cc]); // Set to user currency
    _gaq.push(['_addTrans',
      tx, // transaction ID - required
      'Donations', // affiliation or store name
      amt, // total - required eg '10.50'
      '0', // tax
      '0' // shipping
    ]);
    _gaq.push(['_addItem',
      tx, // transaction ID - required
      product_name, // SKU/code - required
      product_name, // product name
      product_name, // category or variation
      amt, // unit price - required e.g. '10.50'
      '1' // quantity - required
    ]);
    _gaq.push(['_trackTrans']); //submits transaction to the Analytics servers
  }
})();
