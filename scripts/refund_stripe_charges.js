// This script refunds ALL CHARGES related to a given email address.
// This is necessary to help combat large amounts of fraud.

// Config
var Habitat = require('habitat');
Habitat.load();

var stripe = require('stripe')(process.env.STRIPE_API_KEY);
var async = require('async');
var moment = require('moment');
var filter_emails = process.env.CUSTOMER_EMAIL.split(',');
var after_day_count = process.env.AFTER_DAY_COUNT || 60;
var before_day_count = process.env.BEFORE_DAY_COUNT || 0;
var stripe_charge_list_opts = {
  created: {
    gte: moment(Date.now()).subtract(after_day_count, 'days').unix().valueOf(),
    lte: moment(Date.now()).subtract(before_day_count, 'days').unix().valueOf(),
  },
  limit: 100,
  expand: ["data.customer"]
};

var charges;

function refund_charge(charge, done) {
  console.log(`refunding charge ID: ${charge.id}, Amount: ${charge.amount / 100}, currency: ${charge.currency}`);
  stripe.refunds.create({
    charge: charge.id,
    reason: "fraudulent"
  }, function(err, resp) {
    if (err) {
      return done(err);
    }
    done();
  });
}

var charged_to_email = (charge) => filter_email.indexOf(charge.customer.email) >= 0;

var charge_was_paid = (charge) => charge.paid

var charge_not_disputed = (charge) => !charge.dispute

var charge_not_refunded = (charge) => !charge.refunded

async.doWhilst(function(done) {
  stripe.charges.list(
    stripe_charge_list_opts,
    function(err, resp) {
      if (err) {
        return done(err);
      }
      charges = resp;
      async.eachSeries(
        charges.data
          .filter(charged_to_email)
          .filter(charge_was_paid)
          .filter(charge_not_disputed)
          .filter(charge_not_refunded),
        refund_charge,
        done
      );
    }
  );
}, function() {
  if (charges.has_more) {
    console.log('Fetching next page of charges...');
    stripe_charge_list_opts = {
      starting_after: charges.data[charges.data.length - 1].id,
      limit: 100,
      expand: ["data.customer"]
    }
  }
  return charges.has_more;
}, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Done!');
  process.exit(0);
});
