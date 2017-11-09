var signup = require('./signup');
var mailchimp = require('./mailchimp');
var stripe = require('./stripe');
var paypal = require('./paypal');
var boom = require('boom');
var basket = require('../lib/basket-queue.js');
var amountModifier = require('../../dist/lib/amount-modifier.js');

var routes = {
  'signup': function(request, reply) {
    var transaction = request.payload;
    const signup_service = Date.now();

    signup(transaction, function(err, payload) {
      if (err) {
        request.log(['error', 'signup'], {
          request_id: request.headers['x-request-id'],
          service: Date.now() - signup_service,
          code: err.code,
          type: err.type,
          param: err.param
        });

        return reply(boom.wrap(err, 500, 'Unable to complete Basket signup'));
      }

      request.log(['signup'], {
        request_id: request.headers['x-request-id'],
        service: Date.now() - signup_service
      });

      reply(payload).code(201);
    });
  },
  'mailchimp': function(request, reply) {
    var transaction = request.payload;
    const signup_service = Date.now();

    mailchimp(transaction, function(err, payload) {
      if (err) {
        request.log(['error', 'mailchimp'], {
          request_id: request.headers['x-request-id'],
          service: Date.now() - signup_service,
          code: err.code,
          type: err.type,
          param: err.param
        });

        return reply(boom.wrap(err, 500, 'Unable to complete Mailchimp signup'));
      }
      var body = JSON.parse(payload.body);
      if (payload.statusCode !== 200) {
        request.log(['error', 'mailchimp'], {
          request_id: request.headers['x-request-id'],
          service: Date.now() - signup_service,
          code: payload.statusCode,
          message: body.title
        });

        return reply(boom.create(payload.statusCode, 'Unable to complete Mailchimp signup', body));
      }

      request.log(['mailchimp'], {
        request_id: request.headers['x-request-id'],
        service: Date.now() - signup_service
      });
      reply(body).code(201);
    });
  },
  'stripe': function(request, reply) {
    var transaction = request.payload || {};
    var currency = transaction.currency;
    var amount = amountModifier.stripe(transaction.amount, currency);
    var metadata = {
      email: transaction.email,
      locale: transaction.locale
    };
    var request_id = request.headers['x-request-id'];
    if (transaction.description.indexOf("Thunderbird") >= 0 ) {
      metadata.thunderbird = true;
    } else if (transaction.description.indexOf("glassroomnyc") >= 0 ) {
      metadata.glassroomnyc = true;
    }

    stripe.customer({
      metadata,
      email: transaction.email,
      stripeToken: transaction.stripeToken
    }, function(err, customerData) {
      var stripe_customer_create_service = customerData.stripe_customer_create_service;
      var customer;
      var badRequest;

      if (err) {
        badRequest = boom.badRequest('Stripe charge failed');
        badRequest.output.payload.stripe = {
          code: err.code,
          rawType: err.rawType
        };

        request.log(['error', 'stripe', 'customer'], {
          request_id,
          stripe_customer_create_service,
          code: err.code,
          type: err.type,
          param: err.param
        });

        reply(badRequest);
      } else {
        customer = customerData.customer;
        request.log(['stripe', 'customer'], {
          request_id,
          stripe_customer_create_service,
          customer_id: customer.id
        });

        if (transaction.frequency !== 'monthly') {
          stripe.single({
            amount,
            currency,
            metadata,
            customer,
            description: transaction.description
          }, function(err, chargeData) {
            var stripe_charge_create_service = chargeData.stripe_charge_create_service;
            var charge;
            var badRequest;
            if (err) {
              badRequest = boom.badRequest('Stripe charge failed');
              badRequest.output.payload.stripe = {
                code: err.code,
                rawType: err.rawType
              };

              request.log(['error', 'stripe', 'single'], {
                request_id,
                stripe_charge_create_service,
                customer_id: customer.id,
                code: err.code,
                type: err.type,
                param: err.param
              });

              reply(badRequest);
            } else {
              charge = chargeData.charge;
              if (transaction.signup) {
                const signup_service = Date.now();

                signup(transaction, (signup_error, payload) => {
                  if (signup_error) {
                    return request.log(['error', 'signup'], {
                      request_id: request.headers['x-request-id'],
                      service: Date.now() - signup_service,
                      code: signup_error.code,
                      type: signup_error.type,
                      param: signup_error.param
                    });
                  }

                  request.log(['signup'], {
                    request_id: request.headers['x-request-id'],
                    service: Date.now() - signup_service
                  });
                });
              }
              request.log(['stripe', 'single'], {
                request_id,
                stripe_charge_create_service,
                charge_id: charge.id
              });

              basket.queue({
                event_type: "donation",
                last_name: charge.source.name,
                email: charge.metadata.email,
                donation_amount: basket.zeroDecimalCurrencyFix(charge.amount, charge.currency),
                currency: charge.currency,
                created: charge.created,
                recurring: false,
                service: "stripe",
                transaction_id: charge.id,
                project: metadata.thunderbird ? "thunderbird" : ( metadata.glassroomnyc ? "glassroomnyc" : "mozillafoundation" )
              });

              reply({
                frequency: "one-time",
                amount: charge.amount,
                currency: charge.currency,
                id: charge.id,
                customerId: customer.id,
                signup: transaction.signup,
                country: transaction.country,
                email: transaction.email
              }).code(200);
            }
          });
        } else {
          stripe.recurring({
            // Stripe has plans with set amounts, not custom amounts.
            // So to get a custom amount we have a plan set to 1 cent, and we supply the quantity.
            // https://support.stripe.com/questions/how-can-i-create-plans-that-dont-have-a-fixed-price
            currency,
            metadata,
            customer,
            quantity: amount,
            stripeToken: transaction.stripeToken,
            email: transaction.email
          }, function(err, subscriptionData) {
            var stripe_create_subscription_service = subscriptionData.stripe_create_subscription_service;
            var subscription;
            if (err) {
              request.log(['error', 'stripe', 'recurring'], {
                request_id,
                stripe_create_subscription_service,
                customer_id: customer.id,
                code: err.code,
                type: err.type,
                param: err.param
              });
              reply(boom.create(400, 'Stripe subscription failed', {
                code: err.code,
                rawType: err.rawType
              }));
            } else {
              subscription = subscriptionData.subscription;
              if (transaction.signup) {
                const signup_service = Date.now();

                signup(transaction, (signup_error, payload) => {
                  if (signup_error) {
                    return request.log(['error', 'signup'], {
                      request_id: request.headers['x-request-id'],
                      service: Date.now() - signup_service,
                      code: signup_error.code,
                      type: signup_error.type,
                      param: signup_error.param
                    });
                  }

                  request.log(['signup'], {
                    request_id: request.headers['x-request-id'],
                    service: Date.now() - signup_service
                  });
                });
              }
              request.log(['stripe', 'recurring'], {
                request_id,
                stripe_create_subscription_service,
                customer_id: customer.id
              });

              reply({
                frequency: "monthly",
                currency: subscription.plan.currency,
                quantity: subscription.quantity,
                id: subscription.id,
                customerId: customer.id,
                signup: transaction.signup,
                country: transaction.country,
                email: transaction.email
              }).code(200);
            }
          });
        }
      }
    });
  },
  'paypal': function(request, reply) {
    var transaction = request.payload || {};
    var frequency = transaction.frequency || "";
    var currency = transaction.currency;
    var amount = amountModifier.paypal(transaction.amount, currency);

    var details = {
      amount: amount,
      currency: currency,
      locale: transaction.locale,
      item_name: transaction.description,
      serverUri: request.server.info.uri,
      frequency: frequency,
      appName: transaction.appName
    };
    var request_id = request.headers['x-request-id'];
    function callback(err, data) {
      var paypal_request_sale_service = data.paypal_request_sale_service;
      var log_details = {
        request_id,
        paypal_request_sale_service
      };

      if (err) {
        log_details.error = err.toString();

        if (data.response) {
          log_details.error_name = data.response.name;
          log_details.error_message = data.response.message;
          log_details.details = data.response.details;
        }

        request.log(['paypal', 'sale', 'error', frequency], log_details);
        reply(boom.wrap(err, 500, 'Paypal donation failed'));
      } else {
        request.log(['paypal', 'sale', frequency], log_details);
        reply({
          endpoint: process.env.PAYPAL_ENDPOINT,
          token: data.response.TOKEN
        }).code(200);
      }
    }
    paypal.setupCheckout(details, callback);
  },
  'paypal-redirect': function(request, reply) {
    var locale = request.params.locale || '';
    if (locale) {
      locale = '/' + locale;
    }
    var appName = request.params.appName;
    var location = "thank-you";
    if (appName === "thunderbird") {
      location = "thunderbird/" + location;
    }
    var frequency = request.params.frequency || 'single';
    var options = {
      recurring: frequency === 'monthly',
      accountType: request.params.accountType
    };
    var request_id = request.headers['x-request-id'];
    if (frequency !== 'monthly') {
      paypal.getCheckoutDetails({
        token: request.url.query.token
      }, options, function(err, checkoutDetails) {
        var paypal_checkout_details_service = checkoutDetails.paypal_checkout_details_service;
        if (err) {
          request.log(['error', 'paypal', 'checkout-details', frequency], {
            request_id,
            paypal_checkout_details_service,
            // https://developer.paypal.com/docs/api/#errors
            error_name: checkoutDetails.response.name,
            error_message: checkoutDetails.response.message,
            details: checkoutDetails.response.details
          });
          return reply(boom.badRequest('donation failed', err));
        }

        request.log(['paypal', 'checkout-details', frequency], {
          request_id,
          paypal_checkout_details_service
        });

        paypal.completeCheckout(checkoutDetails.response, options, function(err, data) {
          var paypal_checkout_payment_service = data.paypal_checkout_payment_service;
          var log_details = {
            request_id,
            paypal_checkout_payment_service
          };

          if (err) {
            log_details.error = err.toString();

            if (data.response) {
              log_details.error_name = data.response.name;
              log_details.error_message = data.response.message;
              log_details.details = data.response.details;
            }

            request.log(['error', 'paypal', 'checkout-payment', frequency], log_details);
            return reply(boom.badRequest('donation failed', err));
          }

          request.log(['paypal', 'checkout', frequency], log_details);

          var timestamp = new Date(data.txn.PAYMENTINFO_0_ORDERTIME).getTime() / 1000;

          basket.queue({
            event_type: "donation",
            first_name: checkoutDetails.response.FIRSTNAME,
            last_name: checkoutDetails.response.LASTNAME,
            email: checkoutDetails.response.EMAIL,
            donation_amount: data.txn.PAYMENTREQUEST_0_AMT,
            currency: data.txn.CURRENCYCODE,
            created: timestamp,
            recurring: false,
            service: 'paypal',
            transaction_id: data.txn.PAYMENTINFO_0_TRANSACTIONID,
            project: appName
          });

          reply.redirect(`${locale}/${location}/?frequency=${frequency}&tx=${data.txn.PAYMENTINFO_0_TRANSACTIONID}&amt=${data.txn.PAYMENTREQUEST_0_AMT}&cc=${data.txn.CURRENCYCODE}`);
        });
      });
    } else {
      paypal.getCheckoutDetails({
        token: request.url.query.token
      }, options, function(err, checkoutDetails) {
        var paypal_checkout_details_service = checkoutDetails.paypal_checkout_details_service;
        var log_details = {
          request_id,
          paypal_checkout_details_service
        };

        if (err) {
          log_details.error = err.toString();

          if (checkoutDetails.response) {
            log_details.error_name = checkoutDetails.response.name;
            log_details.error_message = checkoutDetails.response.message;
            log_details.details = checkoutDetails.response.details;
          }

          request.log(['error', 'paypal', 'checkout-details', frequency], log_details);
          return reply(boom.badRequest('donation failed', err));
        }

        request.log(['paypal', 'checkout-details', frequency], log_details);

        paypal.completeCheckout(checkoutDetails.response, options, function(err, data) {
          var paypal_checkout_payment_service = data.paypal_checkout_payment_service;
          var log_details = {
            request_id,
            paypal_checkout_payment_service
          };

          if (err) {
            log_details.error = err;

            if (data.response) {
              log_details.error_name = data.response.name;
              log_details.error_message = data.response.message;
              log_details.details = data.response.details;
            }

            request.log(['error', 'paypal', 'checkout-payment', frequency], log_details);
            return reply(boom.wrap(err));
          }

          request.log(['paypal', 'checkout', frequency], log_details);

          var timestamp = new Date(data.txn.TIMESTAMP).getTime() / 1000;

          // Create unique tx id by combining PayerID and timestamp
          var stamp = Date.now() / 100;
          var txId = data.txn.PAYERID + stamp;

          basket.queue({
            event_type: "donation",
            first_name: checkoutDetails.response.FIRSTNAME,
            last_name: checkoutDetails.response.LASTNAME,
            email: checkoutDetails.response.EMAIL,
            donation_amount: data.txn.AMT,
            currency: data.txn.CURRENCYCODE,
            created: timestamp,
            recurring: true,
            frequency: "monthly",
            service: "paypal",
            transaction_id: txId,
            subscription_id: data.txn.PROFILEID,
            project: appName
          });

          reply.redirect(`${locale}/${location}/?frequency=${frequency}&tx=${txId}&amt=${data.txn.AMT}&cc=${data.txn.CURRENCYCODE}`);
        });
      });
    }
  },
  'stripe-charge-failed': function(request, reply) {
    var endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_CHARGE_FAILED;
    var signature = request.headers["stripe-signature"];

    var event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      return reply(boom.forbidden('An error occurred while verifying the webhook signing secret'));
    }

    if (event.type !== 'charge.failed') {
      return reply('This hook only processes charge failed events');
    }

    var charge = event.data.object;

    basket.queue({
      event_type: event.type,
      transaction_id: charge.id,
      failure_code: charge.failure_code
    });

    return reply("charge failed event processed");
  },
  'stripe-charge-refunded': function(request, reply) {
    var endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_CHARGE_REFUNDED;
    var signature = request.headers["stripe-signature"];

    var event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      return reply(boom.forbidden('An error occurred while verifying the webhook signing secret'));
    }

    if (event.type !== 'charge.refunded') {
      return reply('This hook only processes charge.refunded events');
    }

    var event_type = event.type;
    var charge = event.data.object;
    var refund = charge.refunds.data[0];

    var transaction_id = charge.id;
    var reason = refund.reason;
    var status = refund.status;

    if (reason === null) {
      // refunded via dashboard, mark as requested_by_customer
      reason = 'requested_by_customer';
    }

    basket.queue({
      event_type,
      transaction_id,
      reason,
      status
    });

    return reply("charge event processed");
  },
  'stripe-dispute': function(request, reply) {
    var endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_DISPUTE;
    var signature = request.headers["stripe-signature"];

    var event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      return reply(boom.forbidden('An error occurred while verifying the webhook signing secret'));
    }


    var disputeEvents = [
      'charge.dispute.closed',
      'charge.dispute.created',
      'charge.dispute.updated'
    ];


    if (disputeEvents.indexOf(event.type) === -1) {
      return reply('This hook only processes disputes');
    }

    var dispute = event.data.object;

    // kick off a Promise Chain
    Promise.resolve()
      .then(function() {
      // close the dispute automatically if it's not lost already
        if (event === 'charge.dispute.created' && dispute.status === 'lost') {
          return Promise.resolve();
        }

        return stripe.closeDispute(dispute.id)
          .catch(function(closeDisputeError) {
            if (closeDisputeError.message === 'This dispute is already closed') {
              return console.log(closeDisputeError.message);
            }

            return Promise.reject("Could not close the dispute");
          });
      })
      .then(function() {
        basket.queue({
          event_type: event.type,
          transaction_id: dispute.charge,
          reason: dispute.reason,
          status: dispute.status
        });

        reply("dispute processed");
      })
      .catch(function(err) {
        if (err.isBoom) {
          return reply(err);
        }

        return reply(boom.badImplementation('An error occurred while handling the dispute webhook', err));
      });


  },
  'stripe-charge-succeeded': function(request, reply) {
    var endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_CHARGE_SUCCESS;
    var signature = request.headers["stripe-signature"];

    var event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      return reply(boom.forbidden('An error occurred while verifying the webhook signing secret'));
    }

    var charge = event.data.object;

    if (event.type !== 'charge.succeeded') {
      return reply('This hook only processes charge succeeded events');
    }

    stripe.retrieveCharge(
      charge.id,
      function(fetchChargeErr, charge) {
        if (fetchChargeErr) {
          return reply(boom.badImplementation('An error occurred while fetching the invoice for this charge', fetchChargeErr));
        }

        if (!charge.invoice || !charge.invoice.subscription) {
          return reply('Charge not part of a subscription');
        }

        stripe.retrieveSubscription(
          charge.invoice.customer,
          charge.invoice.subscription,
          {
            expand: ["customer"]
          },
          function(retrieveSubscriptionErr, subscription) {
            if (retrieveSubscriptionErr) {
              return reply(boom.badImplementation('An error occurred while fetching the subscription for this charge\'s invoice', retrieveSubscriptionErr));
            }

            var updateData = {
              metadata: subscription.metadata
            };

            if (updateData.metadata.thunderbird) {
              updateData.description = 'Thunderbird monthly';
            } else if (updateData.metadata.glassroomnyc) {
              updateData.description = 'glassroomnyc monthly';
            } else {
              updateData.description = 'Mozilla Foundation Monthly Donation';
            }

            // capture recurring stripe transactions in salesforce
            basket.queue({
              event_type: "donation",
              last_name: subscription.customer.sources.data[0].name,
              email: subscription.customer.email,
              donation_amount: basket.zeroDecimalCurrencyFix(charge.amount, charge.currency),
              currency: charge.currency,
              created: charge.created,
              recurring: true,
              frequency: "monthly",
              service: "stripe",
              transaction_id: charge.id,
              subscription_id: subscription.id,
              project: updateData.metadata.thunderbird ? "thunderbird" : ( updateData.metadata.glassroomnyc ? "glassroomnyc" : "mozillafoundation" )
            });

            stripe.updateCharge(charge.id, updateData, function(updateChargeErr) {
              if (updateChargeErr) {
                return reply(boom.badImplementation('An error occurred while updating the charge'));
              }

              reply('Charge updated');
            });
          }
        );
      }
    );
  }
};

module.exports = routes;
