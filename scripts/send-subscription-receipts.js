'use strict';

require('habitat').load();

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var hatchet = require('hatchet');
var async = require('async');
var moment = require('moment');

var stripe_charge_list_opts = {
  created: {
    lte: moment.unix(new Date(process.env.BEFORE_DATE)).valueOf()
  },
  limit: 100,
  expand: ['data.customer']
};

var charges;

function process_charge_data(charge, done) {
  if (!charge.invoice || !charge.paid) {
    return done();
  }

  console.info(`Sending receipt for charge ${charge.id}`);

  // jlolbuck
  charge.customer_object = charge.customer;

  hatchet.send('stripe_charge_succeeded', charge, function(err, data) {
    if (err) {
      console.error(`failed to queue data for charge ${charge.id}`, err);
    }

    console.info(`queued charge data - message id: ${data.MessageId}`);
    done();
  });
}


async.doWhilst(function(done) {
  stripe.charges.list(
    stripe_charge_list_opts,
    function(err, resp) {
      if (err) {
        return done(err);
      }
      charges = resp;
      async.eachSeries(
        charges.data,
        process_charge_data,
        done
      );
    }
  );
}, function() {
  if (charges.has_more) {
    console.info('Fetching next page of charges...');
    stripe_charge_list_opts = {
      starting_after: charges.data[charges.data.length - 1].id,
      limit: 100,
      expand: ['data.customer']
    }
  }
  return charges.has_more;
}, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info('Done!');
  process.exit(0);
});
