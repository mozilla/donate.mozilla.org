#!/usr/bin/env node

require("habitat").load();

var async = require("async");
var path = require("path");
var Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var currencies = Object.keys(require(path.resolve( __dirname, "../src/data/currencies")));
var local_plans = {};
currencies.forEach((currency) => {
  local_plans[currency] = {
    amount: 1,
    currency: currency,
    id: currency,
    interval: "month",
    interval_count: 1,
    // This is the invoice name that appears on an email invoice from Stripe
    name: "Monthly Donation " + currency,
    // This is the line item name that appears on a credit card statement
    // This needs to be limited to 22 ASCII characters
    // https://stripe.com/docs/api/node#create_plan
    statement_descriptor: "Mozilla Foundation"
  };
});

Stripe.plans.list({
  include: ["total_count"],
  limit: 100
}, function(list_error, plans) {
  if (list_error) {
    throw list_error;
  }

  var stripe_plans = {};
  plans.data.forEach(function(plan) {
    stripe_plans[plan.id] = plan;
  });

  var plans_to_create = currencies.filter(function(currency) {
    return !stripe_plans[currency];
  }).map(function(currency) {
    return local_plans[currency];
  });

  var plans_to_update = currencies.filter(function(currency) {
    return !!stripe_plans[currency] &&
           ( stripe_plans[currency].name !== local_plans[currency].name ||
           stripe_plans[currency].statement_descriptor !== local_plans[currency].statement_descriptor);
  }).map(function(currency) {
    return {
      id: currency,
      name: local_plans[currency].name,
      statement_descriptor: local_plans[currency].statement_descriptor
    };
  });

  if (plans_to_create.length === 0) {
    console.log("No plans to create");
  } else {
    create_plan_q.push(plans_to_create);
  }

  if (plans_to_update.length === 0) {
    console.log("No plans to update");
  } else {
    update_plan_q.push(plans_to_update);
  }
});

var create_plan_q = async.queue(function(plan, done) {
  Stripe.plans.create(plan, function(create_error) {
    if (create_error) {
      throw create_error;
    }

    console.log("Created %s plan", plan.id);
    done();
  });
});

var update_plan_q = async.queue(function(plan, done) {
  Stripe.plans.update(plan.id, {
    name: plan.name,
    statement_descriptor: plan.statement_descriptor
  }, function(update_error) {
    if (update_error) {
      throw update_error;
    }

    console.log("Updated %s plan", plan.id);
    done();
  });
});
