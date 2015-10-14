#!/usr/bin/env node

var AWS = require('aws-sdk');
var CF = new AWS.CloudFormation({
  region: process.env.AWS_DEFAULT_REGION
});
var fs = require('fs');
var path = require('path');

var argv = process.argv.slice(2);
var command = argv.shift();
var environment = argv.shift();
var stack_name = 'donate-mozilla-org-' + environment;
var local_template = fs.readFileSync(path.join(__dirname, '/cloudformation.json'), {encoding: 'utf8'});

if (command === 'get') {
  CF.describeStacks({
    StackName: stack_name
  }, function(describe_error, data) {
    if (describe_error) {
      throw describe_error;
    }

    var stack = data.Stacks[0];
    if (!stack) {
      throw new Error('StackName ' + stack_name + ' does not exist');
    }
    console.log(stack);
  });
} else if (command === 'set') {
  CF.describeStacks({
    StackName: stack_name
  }, function(describe_error, data) {
    if (describe_error) {
      throw describe_error;
    }

    var stack = data.Stacks[0];
    if (!stack) {
      throw new Error('StackName ' + stack_name + ' does not exist');
    }

    CF.getTemplate({
      StackName: stack_name
    }, function(template_error, data) {
      if (template_error) {
        throw template_error;
      }

      var remote_template = data.TemplateBody;
      var use_prev_template = local_template === remote_template;

      // Lets figure out what parameter updates we need to do
      var cli_params = {};
      argv.forEach(function(p) {
        var key = p.substring(0, p.indexOf('='));
        var value = p.substring(p.indexOf('=') + 1);

        cli_params[key] = value;
      });

      var stack_params = stack.Parameters.map(function(p) {
        if (cli_params[p.ParameterKey]) {
          return {
            ParameterKey: p.ParameterKey,
            ParameterValue: cli_params[p.ParameterKey],
            UsePreviousValue: false
          };
        }
        return {
          ParameterKey: p.ParameterKey,
          UsePreviousValue: true
        };
      });

      var update_params = {
        StackName: stack_name,
        UsePreviousTemplate: use_prev_template,
        Parameters: stack_params
      };

      if (!use_prev_template) {
        update_params.TemplateBody = local_template;
      }

      console.log('*** Parameters to update ***');
      console.log(update_params);

      CF.updateStack(update_params, function(update_error) {
        if (update_error) {
          throw update_error;
        }

        console.log('Update queued!');
      });
    });
  });
}
