(function() {
  var queryString = decodeURIComponent(window.location.search);
  var tx = null; // transaction id
  var amt = null;
  var cc = null; // currency code
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

  // Todo: add Stripe parameters

  if (tx && amt && cc) {

    // Optimizely conversion tracking
    window.optimizely = window.optimizely || [];
    window.optimizely.push(['trackEvent', 'donation', {
      'revenue': amt * 100
    }]);

    // We're using univeral analytics ecommerce tracking
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
      'category': product_name, // to-do: make this one-off or monthly
      'price': amt,
      'quantity': '1'
    });

    //submit transaction to the Analytics servers
    ga('ecommerce:send');
  }
})();
