const boom = require('boom');
const stripe = require('../stripe');
const basket = require('../../lib/basket-queue');

const signature_header = 'stripe-signature';
const event_type = 'charge.failed';
const forbidden_error = 'An error occurred while verifying the webhook signing secret';
const incorrect_event_error = 'This hook only processes charge failed events';
const expand_charge_error = 'An error occurred while expanding the charge';
const retrieve_subscription_error = 'An error occurred while fetching the subscription';
const not_recurring_charge = 'This hook only processes recurring charges that fail';
const not_part_of_subscription = 'This charge is not part of a subscription';
const success_message = 'charge failed event processed';
const frequency = 'monthly';
const recurring = true;
const service = 'stripe';

let stripeChargeFailed = (request, reply) => {
  let endpointSecret = process.env.STRIPE_WEBHOOK_SIGNATURE_CHARGE_FAILED;
  let signature = request.headers[signature_header];

  let event = stripe.constructEvent(request.payload, signature, endpointSecret);

  if (!event) {
    return reply(boom.forbidden(forbidden_error));
  }

  if (event.type !== event_type) {
    return reply(incorrect_event_error);
  }

  let {charge} = event.data.object;

  if (!charge.invoice) {
    return reply(not_recurring_charge);
  }

  stripe.retrieveCharge(charge.id, (fetchChargeError, charge) => {
    if (fetchChargeError) {
      return reply(boom.badImplementation(`${expand_charge_error}: ${fetchChargeError}`));
    }

    if (!charge.invoice || !charge.invoice.subscription) {
      return reply(not_part_of_subscription);
    }

    let {customer, subscription} = charge.invoice;

    stripe.retrieveSubscription(customer, subscription, (retrieveSubscriptionError, subscription) => {
      if (retrieveSubscriptionError) {
        return reply(boom.badImplementation(retrieve_subscription_error));
      }

      let {
        currency,
        created,
        id: transaction_id,
        failure_code
      } = charge;

      let {
        id: subscription_id,
        metadata
      } = subscription;

      let last_name = subscription.customer.sources.data[0].name,
        email = subscription.customer.email,
        donation_amount = basket.zeroDecimalCurrencyFix(charge.amount, charge.currency),
        project = metadata.thunderbird ? "thunderbird" : ( metadata.glassroomnyc ? "glassroomnyc" : "mozillafoundation" );

      basket.queue({
        transaction_id,
        subscription_id,
        event_type,
        last_name,
        email,
        donation_amount,
        currency,
        created,
        recurring,
        frequency,
        service,
        project,
        failure_code
      });
    });
  });

  let {id: transaction_id, failure_code} = event.data.object;

  basket.queue({ event_type, transaction_id, failure_code});

  return reply(success_message);
};

module.exports = stripeChargeFailed;
