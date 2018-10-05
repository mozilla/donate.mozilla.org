const iron = require('iron');
const Boom = require('boom');
const request = require('request');
const mailchimpSignup = require('./mailchimp');
const stripe = require('./stripe');
const paypal = require('./paypal');
const basket = require('../lib/basket-queue.js');
const amountModifier = require('../../dist/lib/amount-modifier.js');

const cookiePassword = process.env.SECRET_COOKIE_PASSWORD;

const httpRequest = request.defaults({
  timeout: 25000
});

async function decrypt(encryptedCookie) {
  try {
    return await iron.unseal(encryptedCookie, cookiePassword, iron.defaults);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function encrypt(cookie) {
  try {
    return await iron.seal(cookie, cookiePassword, iron.defaults);
  } catch (err) {
    throw Promise.reject(err);
  }
}


const mailchimp = async function(request, h) {
  const transaction = request.payload;
  const signup_service = Date.now();

  let payload;

  try {
    payload = await mailchimpSignup(transaction);
  } catch (err) {
    request.log(['error', 'mailchimp'], {
      request_id: request.headers['x-request-id'],
      service: Date.now() - signup_service,
      code: err.code,
      type: err.type,
      param: err.param
    });

    throw Boom.boomify(err, 500, 'Unable to complete Mailchimp signup');
  }


  let body = JSON.parse(payload.body);

  if (payload.statusCode !== 200) {
    request.log(['error', 'mailchimp'], {
      request_id: request.headers['x-request-id'],
      service: Date.now() - signup_service,
      code: payload.statusCode,
      message: body.title
    });

    throw new Boom(payload.statusCode, 'Unable to complete Mailchimp signup', body);
  }

  request.log(['mailchimp'], {
    request_id: request.headers['x-request-id'],
    service: Date.now() - signup_service
  });

  return h.response(body).code(201);
};

const routes = {
  signup: require('./signup'),
  mailchimp,
  'reCaptcha': async function(request, h) {
    const payload = request.payload || {};
    const reCaptchaToken = payload.reCaptchaToken || "";

    return new Promise((resolve, reject) => {
      if (process.env.RECAPTCHA_DISABLED) {
        return resolve("OK");
      }
      httpRequest({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'POST',
        json: true,
        form: {
          'secret': process.env.RECAPTCHA_SECRET_KEY,
          'response': reCaptchaToken
        }
      }, function(err, httpResponse, body) {
        if (err) {
          return reject(err);
        }

        if (!body.success) {
          reject(new Boom(403, body.errorCodes, body));
        }

        resolve("OK");
      });
    });
  },
  'stripe': async function(request, h) {
    const transaction = request.payload || {};
    const {
      currency,
      email,
      locale,
      description,
      stripeToken,
      frequency,
      signup,
      country,
      donation_url
    } = transaction;
    const amount = amountModifier.stripe(transaction.amount, currency);
    const metadata = { email, locale };
    const request_id = request.headers['x-request-id'];

    let badRequest;
    let stripe_charge_create_service;
    let stripe_customer_create_service;

    if (description.indexOf("Thunderbird") >= 0 ) {
      metadata.thunderbird = true;
    } else if (description.indexOf("glassroomnyc") >= 0 ) {
      metadata.glassroomnyc = true;
    }

    const startCreateCustomer = Date.now();
    let customer;

    try {
      customer = await stripe.customer({ metadata, email, stripeToken });
    } catch (err) {
      stripe_customer_create_service = Date.now() - startCreateCustomer;
      badRequest = Boom.badRequest('Stripe charge failed');

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

      throw badRequest;
    }

    stripe_customer_create_service = Date.now() - startCreateCustomer;

    request.log(['stripe', 'customer'], {
      request_id,
      stripe_customer_create_service,
      customer_id: customer.id
    });

    if (frequency !== 'monthly') {
      const startCreateCharge = Date.now();
      let charge;

      try {
        charge = await stripe.single({ amount, currency, metadata, description, customer: customer.id });
      } catch (err) {
        stripe_charge_create_service = Date.now() - startCreateCharge;
        badRequest = Boom.badRequest('Stripe charge failed');

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

        throw badRequest;
      }

      stripe_charge_create_service = Date.now() - startCreateCharge;

      if (signup) {
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
        project: metadata.thunderbird ? "thunderbird" : ( metadata.glassroomnyc ? "glassroomnyc" : "mozillafoundation" ),
        donation_url,
        locale
      });

      const cookie = {
        stripeCustomerId: customer.id
      };
      const response = {
        frequency: "one-time",
        amount: charge.amount,
        currency: charge.currency,
        id: charge.id,
        signup,
        country,
        email
      };

      try {
        const encryptedCookie = await encrypt(cookie);
        return h.response(response)
          .state("session", encryptedCookie)
          .code(200);

      } catch (err) {
        request.log(['error', 'stripe', 'single', 'cookie'], {
          request_id,
          customer_id: customer.id,
          code: err.code,
          message: err.message
        });

        return h.response(response).code(200);
      }
    } else {
      // Monthly Stripe donation
      let startCreateSubscription = Date.now();
      let stripe_create_subscription_service;
      let subscription;

      metadata.donation_url = donation_url;

      try {
        subscription = await stripe.recurring({
          // Stripe has plans with set amounts, not custom amounts.
          // So to get a custom amount we have a plan set to 1 cent, and we supply the quantity.
          // https://support.stripe.com/questions/how-can-i-create-plans-that-dont-have-a-fixed-price
          currency,
          metadata,
          customer,
          stripeToken,
          email,
          quantity: amount
        });
      } catch (err) {
        stripe_create_subscription_service = Date.now() - startCreateSubscription;
        badRequest = Boom.badRequest('Stripe subscription failed', {
          code: err.code,
          rawType: err.rawType
        });

        request.log(['error', 'stripe', 'recurring'], {
          request_id,
          stripe_create_subscription_service,
          customer_id: customer.id,
          code: err.code,
          type: err.type,
          param: err.param
        });

        throw badRequest;
      }

      stripe_create_subscription_service = Date.now() - startCreateSubscription;

      if (signup) {
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

      return h.response({
        frequency: "monthly",
        currency: subscription.plan.currency,
        quantity: subscription.quantity,
        id: subscription.id,
        signup,
        country,
        email
      }).code(200);
    }
  },
  stripeMonthlyUpgrade: async function(request, h) {
    const transaction = request.payload || {};
    const encryptedCookie = request.state && request.state.session;
    const { currency } = transaction;
    const amount = amountModifier.stripe(transaction.amount, currency);
    const metadata = {
      locale: transaction.locale
    };
    const request_id = request.headers['x-request-id'];

    let cookie;

    if (transaction.description.indexOf("Thunderbird") >= 0 ) {
      metadata.thunderbird = true;
    } else if (transaction.description.indexOf("glassroomnyc") >= 0 ) {
      metadata.glassroomnyc = true;
    }

    if (!encryptedCookie) {
      request.log(['error', 'stripe', 'recurring', 'upgrade'], {
        request_id,
        err: 'Cookie does not exist'
      });

      throw Boom.badRequest('An error occurred while creating this monthly donation');
    }

    try {
      cookie = await decrypt(encryptedCookie);
    } catch (err) {
      request.log(['error', 'stripe', 'recurring', 'upgrade'], {
        request_id,
        code: err.code,
        message: err.message
      });

      throw Boom.badImplementation('An error occurred while creating this monthly donation');
    }
    const customerId = cookie && cookie.stripeCustomerId;

    if (!customerId) {
      request.log(['error', 'stripe', 'recurring', 'upgrade'], {
        request_id,
        err: 'Customer ID missing from the cookie'
      });

      throw Boom.badRequest('An error occurred while creating this monthly donation');
    }

    let customer;

    try {
      customer = await stripe.retrieveCustomer(customerId);
    } catch (err) {
      throw Boom.badImplementation('An error occurred while creating this monthly donation', err);
    }

    const { id: customer_id } = customer;
    let startCreateSubscription = Date.now();
    let stripe_create_subscription_service;
    let subscription;

    try {
      // Make this with a monthly delay for the user.
      subscription = await stripe.recurring({
        // Stripe has plans with set amounts, not custom amounts.
        // So to get a custom amount we have a plan set to 1 cent, and we supply the quantity.
        // https://support.stripe.com/questions/how-can-i-create-plans-that-dont-have-a-fixed-price
        currency,
        metadata,
        customer,
        quantity: amount,
        trialPeriodDays: "30"
      });
    } catch (err) {
      stripe_create_subscription_service = Date.now() - startCreateSubscription;
      const { code, type, param } = err;

      request.log(['error', 'stripe', 'recurring', 'upgrade'], {
        request_id,
        stripe_create_subscription_service,
        customer_id,
        code,
        type,
        param
      });

      throw Boom.badRequest('Stripe subscription failed', {
        code: err.code,
        rawType: err.rawType
      });
    }

    stripe_create_subscription_service = Date.now() - startCreateSubscription;

    request.log(['stripe', 'recurring', 'upgrade'], {
      request_id,
      stripe_create_subscription_service,
      customer_id
    });

    return h.response({
      frequency: "monthly",
      currency: subscription.plan.currency,
      quantity: subscription.quantity,
      id: subscription.id
    })
      .unstate("session")
      .code(200);
  },
  'paypal': async function(request, h) {
    let transaction = request.payload || {};
    let frequency = transaction.frequency || "";
    let currency = transaction.currency;
    let amount = amountModifier.paypal(transaction.amount, currency);
    let subscribed = transaction.subscribed || "0";

    let details = {
      amount: amount,
      currency: currency,
      locale: transaction.locale,
      item_name: transaction.description,
      serverUri: request.server.info.uri,
      frequency: frequency,
      appName: transaction.appName,
      subscribed: subscribed
    };
    let request_id = request.headers['x-request-id'];

    let checkoutDetails;
    let paypal_request_sale_service;

    const paypalRequestSaleStart = Date.now();
    try {
      checkoutDetails = await paypal.setupCheckout(details);
    } catch (err) {
      paypal_request_sale_service = Date.now() - paypalRequestSaleStart;

      request.log(['paypal', 'sale', 'error', frequency], {
        request_id,
        paypal_request_sale_service,
        error: err.toString()
      });

      throw Boom.boomify(err, 500, 'Paypal donation failed');
    }

    paypal_request_sale_service = Date.now() - paypalRequestSaleStart;

    request.log(['paypal', 'sale', frequency], {
      request_id,
      paypal_request_sale_service
    });

    const response = {
      endpoint: process.env.PAYPAL_ENDPOINT,
      token: checkoutDetails.TOKEN
    };

    return h.response(response).code(200);
  },
  'paypal-redirect': async function(request, h) {
    let locale = request.params.locale || '';
    if (locale) {
      locale = '/' + locale;
    }

    let appName = request.params.appName;
    let subscribed = request.params.subscribed;
    let location = "thank-you";
    if (appName === "thunderbird") {
      location = "thunderbird/" + location;
    }
    let frequency = request.params.frequency || 'single';
    let options = {
      recurring: frequency === 'monthly',
      accountType: request.params.accountType
    };
    let request_id = request.headers['x-request-id'];

    if (frequency !== 'monthly') {
      let checkoutDetails;
      let paypal_checkout_details_service;
      const paypalCheckoutDetailsStart = Date.now();

      try {
        checkoutDetails = await paypal.getCheckoutDetails({
          token: request.url.query.token
        }, options);
      } catch (err) {
        paypal_checkout_details_service = Date.now() - paypalCheckoutDetailsStart;
        request.log(['error', 'paypal', 'checkout-details', frequency], {
          request_id,
          paypal_checkout_details_service,
          // https://developer.paypal.com/docs/api/#errors
          error_name: checkoutDetails.name,
          error_message: checkoutDetails.message,
          details: checkoutDetails.details
        });

        throw Boom.badRequest('donation failed', err);
      }

      paypal_checkout_details_service = Date.now() - paypalCheckoutDetailsStart;

      request.log(['paypal', 'checkout-details', frequency], {
        request_id,
        paypal_checkout_details_service
      });

      let checkoutData;
      let paypal_checkout_payment_service;

      const paypalCheckoutPaymentStart = Date.now();

      try {
        checkoutData = await paypal.completeCheckout(checkoutDetails, options);
      } catch (err) {
        paypal_checkout_payment_service = Date.now() - paypalCheckoutPaymentStart;

        request.log(['error', 'paypal', 'checkout-payment', frequency], {
          request_id,
          paypal_checkout_payment_service,
          error: err.toString()
        });

        throw Boom.badRequest('donation failed', err);
      }

      paypal_checkout_payment_service = Date.now() - paypalCheckoutPaymentStart;

      let {
        PAYMENTREQUEST_0_AMT: donation_amount,
        CURRENCYCODE: currency,
        PAYMENTINFO_0_ORDERTIME: orderTime,
        PAYMENTINFO_0_TRANSACTIONID: transaction_id
      } = checkoutData;

      let {
        FIRSTNAME: first_name,
        LASTNAME: last_name,
        EMAIL: email
      } = checkoutDetails;

      request.log(['paypal', 'checkout', frequency], {
        request_id,
        paypal_checkout_payment_service
      });

      let created = new Date(orderTime).getTime() / 1000;

      basket.queue({
        event_type: "donation",
        first_name,
        last_name,
        email,
        donation_amount,
        currency,
        created,
        recurring: false,
        service: 'paypal',
        transaction_id,
        project: appName,
        locale: locale.substr(1)
      });

      return h.redirect(`${locale}/${location}/?frequency=${frequency}&tx=${transaction_id}&amt=${donation_amount}&cc=${currency}&email=${email}&subscribed=${subscribed}`)
        .unstate("session");
    }

    let paypal_checkout_details_service;
    let checkoutDetails;
    const paypalCheckoutDetailsStart = Date.now();

    try {
      checkoutDetails = await paypal.getCheckoutDetails({
        token: request.url.query.token
      }, options);
    } catch (err) {
      paypal_checkout_details_service = Date.now() - paypalCheckoutDetailsStart;

      request.log(['error', 'paypal', 'checkout-details', frequency], {
        request_id,
        paypal_checkout_details_service,
        error: err.toString()
      });

      throw Boom.badRequest('donation failed', err);
    }

    paypal_checkout_details_service = Date.now() - paypalCheckoutDetailsStart;

    request.log(['paypal', 'checkout-details', frequency], {
      request_id,
      paypal_checkout_details_service
    });

    let checkoutData;
    let paypal_checkout_payment_service;

    const paypalCheckoutPaymentStart = Date.now();

    try {
      checkoutData = await paypal.completeCheckout(checkoutDetails, options);
    } catch (err) {
      paypal_checkout_payment_service = Date.now() - paypalCheckoutPaymentStart;

      request.log(['error', 'paypal', 'checkout-payment', frequency], {
        request_id,
        paypal_checkout_payment_service,
        err: err.toString()
      });

      throw Boom.boomify(err);
    }

    paypal_checkout_payment_service = Date.now() - paypalCheckoutPaymentStart;

    request.log(['paypal', 'checkout', frequency], {
      request_id,
      paypal_checkout_payment_service
    });

    let {
      TIMESTAMP: timestamp,
      AMT: donation_amount,
      CURRENCYCODE: currency,
      PAYERID: payerId,
      PROFILEID: subscription_id
    } = checkoutData;

    let {
      FIRSTNAME: first_name,
      LASTNAME: last_name,
      EMAIL: email
    } = checkoutDetails;

    timestamp = new Date(timestamp).getTime() / 1000;

    // Create unique tx id by combining PayerID and timestamp
    let stamp = Date.now() / 100;
    let transaction_id = payerId + stamp;

    basket.queue({
      event_type: "donation",
      first_name,
      last_name,
      email,
      donation_amount,
      currency,
      created: timestamp,
      recurring: true,
      frequency: "monthly",
      service: "paypal",
      transaction_id,
      subscription_id,
      project: appName,
      locale: locale.substr(1)
    });

    return h.redirect(`${locale}/${location}/?frequency=${frequency}&tx=${transaction_id}&amt=${donation_amount}&cc=${currency}&email=${email}&subscribed=${subscribed}`)
      .unstate("session");
  },
  'stripe-charge-refunded': function(request, h) {
    let endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_CHARGE_REFUNDED;
    let signature = request.headers["stripe-signature"];

    let event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      throw Boom.forbidden('An error occurred while verifying the webhook signing secret');
    }

    if (event.type !== 'charge.refunded') {
      return h.response('This hook only processes charge.refunded events');
    }

    let event_type = event.type;
    let charge = event.data.object;
    let refund = charge.refunds.data[0];

    let transaction_id = charge.id;
    let reason = refund.reason;
    let status = refund.status;

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

    return h.response("charge event processed");
  },
  'stripe-dispute': async function(request, h) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_DISPUTE;
    const signature = request.headers["stripe-signature"];
    const event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      throw Boom.forbidden('An error occurred while verifying the webhook signing secret');
    }

    const disputeEvents = [
      'charge.dispute.closed',
      'charge.dispute.created',
      'charge.dispute.updated'
    ];

    if (disputeEvents.indexOf(event.type) === -1) {
      return h.response('This hook only processes disputes');
    }

    const {
      id: dispute_id,
      charge: transaction_id,
      status,
      reason
    } = event.data.object;

    const event_type = event.type;

    if (event_type === 'charge.dispute.created' && status !== 'lost') {
      try {
        await stripe.closeDispute(dispute_id);
        // statements
      } catch (err) {
        if (err.message === 'This dispute is already closed') {
          return console.log(err.message);
        }

        throw Boom.badRequest("Could not close the dispute");
      }
    }

    basket.queue({ event_type, transaction_id, reason, status });

    return h.response("dispute processed");
  },
  'stripe-charge-succeeded': async function(request, h) {
    let endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_CHARGE_SUCCESS;
    let signature = request.headers["stripe-signature"];

    let event = stripe.constructEvent(request.payload, signature, endpointSecret);

    if (!event) {
      throw Boom.forbidden('An error occurred while verifying the webhook signing secret');
    }

    let { id } = event.data.object;

    if (event.type !== 'charge.succeeded') {
      return h.response('This hook only processes charge succeeded events');
    }

    let charge;

    try {
      charge = await stripe.retrieveCharge(id);
    } catch (err) {
      throw Boom.badImplementation('An error occurred while fetching the invoice for this charge', err);
    }

    if (!charge.invoice || !charge.invoice.subscription) {
      return h.response('Charge not part of a subscription');
    }

    let {
      customer: customer,
      subscription: subscription
    } = charge.invoice;

    try {
      subscription = await stripe.retrieveSubscription(customer, subscription, { expand: ['customer'] });
    } catch (err) {
      throw Boom.badImplementation('An error occurred while fetching the subscription for this charge\'s invoice', err);
    }

    let metadata = subscription.metadata;

    let updateData = { metadata };

    let donation_url = '';

    if (metadata.donation_url) {
      donation_url = metadata.donation_url;
    }

    if (metadata.thunderbird) {
      updateData.description = 'Thunderbird monthly';
    } else if (metadata.glassroomnyc) {
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
      donation_url,
      project: metadata.thunderbird ? "thunderbird" : ( metadata.glassroomnyc ? "glassroomnyc" : "mozillafoundation" ),
      locale: subscription.metadata.locale
    });

    try {
      await stripe.updateCharge(charge.id, updateData);
    } catch (err) {
      throw Boom.badImplementation('An error occurred while updating the charge');
    }

    return h.response('Charge updated');
  },
  'stripe-charge-failed': require('./webhooks/stripe-charge-failed.js')
};

module.exports = routes;
