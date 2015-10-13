var stripeKeys = {
  publishableKey: process.env.STRIPE_PUBLIC_KEY,
  // This is just a test key right now, nothing secret about it.
  secretKey: process.env.STRIPE_SECRET_KEY
};

var stripe = require('stripe')(stripeKeys.secretKey);

module.exports = {
  single: function (transaction, callback) {
    var charge = {
      amount: transaction.amount,
      currency: transaction.currency,
      card: transaction.stripeToken
    };
    stripe.charges.create(charge, callback);
  },
  recurring: function (transaction, callback) {
    stripe.customers.create({
      email: transaction.email,
      metadata: transaction.metadata
    }, function (err, customer) {
      if (err) {
        callback(err);
      } else {
        var subscription = {
          plan: transaction.currency,
          quantity: transaction.quantity,
          source: transaction.stripeToken
        };
        stripe.customers.createSubscription(customer.id, subscription, callback);
      }
    });
  }
};
