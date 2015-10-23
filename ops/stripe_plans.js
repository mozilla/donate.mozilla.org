#!/usr/bin/env node

var async = require("async");
var currencies = Object.keys(require("../data/currencies"));
var Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
    return {
      amount: 1,
      currency: currency,
      id: currency,
      interval: "month",
      interval_count: 1,
      // This is the invoice name that appears on an email invoice from Stripe
      name: "Mozilla Foundation Donation",
      // This is the line item name that appears on a credit card statement
      // This needs to be limited to 22 ASCII characters
      // https://stripe.com/docs/api/node#create_plan
      statement_descriptor: "Mozilla Foundation"
    };
  });

  if (plans_to_create === 0) {
    console.log("No plans to create");
    return;
  }

  create_plan_q.push(plans_to_create);
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
