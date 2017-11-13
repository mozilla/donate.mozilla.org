var stripeKeys = {
  publishableKey: process.env.STRIPE_PUBLIC_KEY,
  // This is just a test key right now, nothing secret about it.
  secretKey: process.env.STRIPE_SECRET_KEY
};

var stripe = require('stripe')(stripeKeys.secretKey);
stripe.setTimeout(25000);

var stripeRoutes = {
  customer: function(transaction, callback) {
    var startCreateCustomer = Date.now();
    stripe.customers.create({
      email: transaction.email,
      metadata: transaction.metadata,
      source: transaction.stripeToken
    }, function(err, customer) {
      var stripe_customer_create_service = Date.now() - startCreateCustomer;
      if (err) {
        return callback(err, {
          stripe_customer_create_service
        });
      }

      callback(null, {
        stripe_customer_create_service,
        customer
      });
    });
  },
  single: function(transaction, callback) {
    var charge = {
      amount: transaction.amount,
      currency: transaction.currency,
      customer: transaction.customer.id,
      description: transaction.description,
      metadata: transaction.metadata
    };
    var startCreateCharge = Date.now();
    stripe.charges.create(charge,
      function(err, charge) {
        var stripe_charge_create_service = Date.now() - startCreateCharge;

        if (err) {
          return callback(err, {
            stripe_charge_create_service
          });
        }

        callback(null, {
          stripe_charge_create_service,
          charge
        });
      }
    );
  },
  recurring: function(transaction, callback) {
    var subscription = {
      plan: transaction.currency,
      quantity: transaction.quantity,
      metadata: transaction.metadata
    };
    var startCreateSubscription = Date.now();
    stripe.customers.createSubscription(transaction.customer.id, subscription,
      function(err, subscription) {
        var stripe_create_subscription_service = Date.now() - startCreateSubscription;
        callback(err, {
          stripe_create_subscription_service,
          subscription
        });
      }
    );
  },
  closeDispute: function(disputeId) {
    return stripe.disputes.close(disputeId);
  },
  updateCharge: function(chargeId, updateData, callback) {
    stripe.charges.update(chargeId, updateData, callback);
  },
  retrieveDispute: function(disputeId) {
    return stripe.disputes.retrieve(disputeId, {
      expand: ["charge"]
    });
  },
  retrieveCharge: function(chargeId, callback) {
    stripe.charges.retrieve(chargeId, {
      expand: ["invoice"]
    }, callback);
  },
  retrieveSubscription: function(customerId, subscriptionId, options, callback) {
    stripe.customers.retrieveSubscription(customerId, subscriptionId, options, callback);
  },
  retrieveCustomer: function(customerId, callback) {
    stripe.customers.retrieve(customerId, callback);
  },
  constructEvent: function(payload, signature, endpointSecret) {
    var event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (constructEventErr) {
      console.error('constructEvent error: ', constructEventErr);
    }

    return event;
  }
};

module.exports = stripeRoutes;
