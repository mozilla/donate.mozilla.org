let boom = require('boom');
let stripe = require('./stripe');
let doSignup = require('./signup');
let amountModifier = require('../../dist/lib/amount-modifier.js');

// define some constant values
const oneTime = 'one-time';
const monthly = 'monthly';
const single = 'single';
const requestIdHeader = 'x-request-id';
const errorMessage = 'Stripe SEPA charge failed';

// Success logging tags
const createCustomerTags = ['stripe', 'sepa', 'customer'];
const createChargeTags = ['stripe', 'sepa', 'single'];
const createSubscriptionTags = ['stripe', 'sepa', 'recurring'];
const signupTags = ['stripe', 'sepa', 'signup'];

// Error logging tags
const createCustomerErrorTags = ['error', 'stripe', 'sepa', 'customer'];
const createSingleChargeErrorTags = ['error', 'stripe', 'sepa', 'single'];
const createRecurringChargeErrorTags = ['error', 'stripe', 'sepa', 'recurring'];
const signupErrorTags = ['error', 'stripe', 'sepa', 'signup'];

// process mailing list signups
let processSignup = (payload, request, request_id) => {
  let signup_service = Date.now();

  doSignup(payload, (err) => {
    if (err) {
      return request.log(signupErrorTags, {
        request_id,
        service: Date.now() - signup_service,
        code: err.code,
        type: err.type,
        param: err.param
      });
    }

    request.log(signupTags, {
      request_id,
      service: Date.now() - signup_service
    });
  });
};

// This is the route handler function
let stripeSepa = (request, reply) => {
  let payload = request.payload || {};
  let {
    currency,
    source,
    email,
    locale,
    amount,
    description,
    signup,
    country
  } = request.payload;

  amount = amountModifier.stripe(amount, currency);

  let metadata = { email, locale };
  let request_id = request.headers[requestIdHeader];

  // Create Customer
  stripe.customer({
    metadata,
    email,
    source
  }, (err, result) => {
    let {stripe_customer_create_service} = result,
      customer,
      badRequest;

    if (err) {
      badRequest = boom.badRequest();
      badRequest.output.payload.stripe = {
        code: err.code,
        rawType: err.rawType
      };

      request.log(createCustomerErrorTags, {
        request_id,
        stripe_customer_create_service,
        code: err.code,
        type: err.type,
        param: err.param
      });

      return reply(badRequest);
    }

    ({customer} = result);

    request.log(createCustomerTags, {
      request_id,
      stripe_customer_create_service,
      customer_id: customer.id
    });

    if (payload.frequency === single) {
      // Create a single charge, using the new Customer, and the associated SEPA Source
      stripe.sepa.single(
        amount,
        currency,
        customer,
        source,
        description,
        metadata,
        (err, result) => {
          let {stripe_charge_create_service} = result,
            charge,
            badRequest;

          if (err) {
            badRequest = boom.badRequest(errorMessage);
            badRequest.output.payload.stripe = {
              code: err.code,
              rawType: err.rawType
            };

            request.log(createSingleChargeErrorTags, {
              request_id,
              stripe_charge_create_service,
              customer_id: customer.id,
              code: err.code,
              type: err.type,
              param: err.param
            });

            return reply(badRequest);
          }

          // grab the new Charge from the result object
          ({charge} = result);

          request.log(createChargeTags, {
            request_id,
            stripe_charge_create_service,
            charge_id: charge.id
          });

          if (signup) {
            processSignup(payload, request, request_id);
          }


          reply({
            id: charge.id,
            frequency: oneTime,
            amount: charge.amount,
            currency: charge.currency,
            sepa: true,
            signup,
            country,
            email
          }).code(200);
        }
      );
    } else {
      stripe.sepa.recurring(
        // Stripe has plans with set amounts, not custom amounts.
        // So to get a custom amount we have a plan set to 1 cent, and we supply the quantity.
        // https://support.stripe.com/questions/how-can-i-create-plans-that-dont-have-a-fixed-price
        customer,
        currency,
        amount,
        metadata,
        source,
        function(err, result) {
          var {stripe_create_subscription_service} = result;
          var subscription;

          if (err) {
            request.log(createRecurringChargeErrorTags, {
              request_id,
              stripe_create_subscription_service,
              customer_id: customer.id,
              code: err.code,
              type: err.type,
              param: err.param
            });

            return reply(boom.create(400, errorMessage, {
              code: err.code,
              rawType: err.rawType
            }));
          }

          ({subscription} = result);

          if (signup) {
            processSignup(payload, request, request_id);
          }

          request.log(createSubscriptionTags, {
            request_id,
            stripe_create_subscription_service,
            customer_id: customer.id
          });

          reply({
            id: subscription.id,
            frequency: monthly,
            currency: subscription.plan.currency,
            quantity: subscription.quantity,
            sepa: true,
            signup,
            country,
            email
          }).code(200);
        }
      );
    }
  });
};

module.exports = stripeSepa;
