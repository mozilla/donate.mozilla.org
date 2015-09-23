var stripeKeys = {
  publishableKey: process.env.STRIPE_PUBLIC_KEY,
  // This is just a test key right now, nothing secret about it.
  secretKey: process.env.STRIPE_SECRET_KEY
};

var stripe = require('stripe')(stripeKeys.secretKey);

module.exports = {
  single: function(transaction, callback) {
    var charge = {
      // stripe works in cents
      amount: transaction.amount * 100,
      currency: transaction.currency,
      card: transaction.stripeToken
    };
    stripe.charges.create(charge, callback);
  },
  recurring: function(transaction, callback) {
    stripe.customers.create({
      email: transaction.email,
      metadata: transaction.metadata
    }, function(err, customer) {
      if (err) {
        callback(err);
      } else {
        var amt = parseFloat(transaction.amount, 10);
        var subscription = {
          plan: transaction.currency,
          // Stripe has plans with set amounts, not custom amounts.
          // So to get a custom amount we have a plan set to 1 cent, and we supply the quantity.
          // https://support.stripe.com/questions/how-can-i-create-plans-that-dont-have-a-fixed-price
          quantity: amt * 100,
          source: transaction.stripeToken
        };
        stripe.customers.createSubscription(customer.id, subscription, callback);
      }
    });
  }
};
