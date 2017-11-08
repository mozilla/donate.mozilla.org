let boom = require('boom');
let stripe = require('./stripe');
let doSignup = require('./signup');
let basket = require('../lib/basket-queue.js');
let amountModifier = require('../../dist/lib/amount-modifier.js');

// define some constant values
const event_type = 'donation';
const project = 'mozillafoundation';
const service = 'stripe';
const oneTime = 'one-time';
// const monthly = 'monthly';
const single = 'single';
const requestIdHeader = 'x-request-id';
const errorMessage = 'Stripe SEPA charge failed';
const createCustomerErrorTags = ['error', 'stripe', 'sepa', 'customer'];
const createCustomerTags = ['stripe', 'sepa', 'customer'];
const createChargeErrorTags = ['error', 'stripe', 'sepa', 'single'];
const createChargeTags = ['stripe', 'sepa', 'single'];
const signupErrorTags = ['error', 'stripe', 'sepa', 'signup'];
const signupTags = ['stripe', 'sepa', 'signup'];

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
  }, (err, customerData) => {
    let stripe_customer_create_service = customerData.stripe_customer_create_service,
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

    customer = customerData.customer;

    request.log(createCustomerTags, {
      request_id,
      stripe_customer_create_service,
      customer_id: customer.id
    });

    if (payload.frequency === single) {
      // Create a single charge, using the new Customer, and the associated SEPA Source
      stripe.sepaSingle(
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

            request.log(createChargeErrorTags, {
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

          // process mailing list signups
          if (signup) {
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
          }

          // TODO: Determine if we should instead send this receipt once a sepa payment is successfully captured
          basket.queue({
            event_type,
            email,
            last_name: charge.source.name,
            donation_amount: basket.zeroDecimalCurrencyFix(charge.amount, charge.currency),
            currency: charge.currency,
            created: charge.created,
            recurring: false,
            service,
            transaction_id: charge.id,
            project
          });

          reply({
            id: charge.id,
            frequency: oneTime,
            amount: charge.amount,
            currency: charge.currency,
            signup,
            country,
            email
          }).code(200);
        }
      );
    } else {
      // not sure if we're doing this.
    }
  });
};

module.exports = stripeSepa;
