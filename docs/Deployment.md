# Deployment

## AWS

- [donate.mofostaging.net](https://donate.mofostaging.net/)
- [donate.mofoprod.net](https://donate.mofoprod.net/)

Any changes to the [CloudFormation template](../ops/cloudformation.json) must be deployed manually.
The CloudFormation stacks `donate-mozilla-org-staging` and `donate-mozilla-org-production` are deployed in `us-east-1` in the `mofo-secure` AWS account.

### Prerequisites

- AWS IAM credentials (ask jbuck for them)

### Deploy tool

If you'd like to update the template or the parameters you should use [the deploy tool](deploy.js).
To fetch the stacks current state use the `get` command:

```
$ node ops/deploy.js get staging
{ StackId: 'arn:aws:cloudformation:us-east-1:318526611700:stack/donate-mozilla-org-staging/ff18a190-4133-11e5-9ebf-5001dc3ed86e',
  StackName: 'donate-mozilla-org-staging',
  Description: 'AWS resources for donate.mozilla.org',
  Parameters:
   [ { ParameterKey: 'LogBucketName',
       ParameterValue: 'logs-s3bucket-1qkkk2485xips' },
     { ParameterKey: 'CloudfrontAliases',
       ParameterValue: 'donate.mofostaging.net' },
     { ParameterKey: 'ApplicationURL',
       ParameterValue: 'donate-mozilla-org-eu-staging.herokuapp.com' },
     { ParameterKey: 'IAMCertificateId',
       ParameterValue: 'ASCAI7WNHRDSDVL4XBNN6' } ],
  CreationTime: Wed Aug 12 2015 16:52:08 GMT-0400 (EDT),
  LastUpdatedTime: Tue Aug 18 2015 21:48:59 GMT-0400 (EDT),
  StackStatus: 'UPDATE_IN_PROGRESS',
  DisableRollback: false,
  NotificationARNs: [],
  Capabilities: [],
  Outputs:
   [ { OutputKey: 'CloudfrontURL',
       OutputValue: 'd2i7tygoojoeom.cloudfront.net',
       Description: 'URL for Cloudfront distribution' } ],
  Tags:
   [ { Key: 'project', Value: 'fundraising' },
     { Key: 'application', Value: 'donate.mozilla.org' },
     { Key: 'environment', Value: 'staging' } ] }
```

To update the stack use the `set` command:

```
$ node ops/deploy.js set staging ApplicationURL=donate-mozilla-org-eu-staging.herokuapp.com
*** Parameters to update ***
{ StackName: 'donate-mozilla-org-staging',
  UsePreviousTemplate: true,
  Parameters:
   [ { ParameterKey: 'LogBucketName', UsePreviousValue: true },
     { ParameterKey: 'CloudfrontAliases', UsePreviousValue: true },
     { ParameterKey: 'ApplicationURL',
       ParameterValue: 'donate-mozilla-org-eu-staging.herokuapp.com',
       UsePreviousValue: false },
     { ParameterKey: 'IAMCertificateId', UsePreviousValue: true } ] }
Update queued!
```

If the [local CloudFormation template](../ops/cloudformation.json) differs from the stacks current template, then the `set` command will also update the template.

### Multi-region failover

We have donate.mozilla.org running in both Heroku regions. If one region is encountering problems, we can use the deploy tool to failover the CDN to the other working region.

You can initiate this by setting the `ApplicationURL` of the stack to the other region. A complete failover can take as long as 15 minutes while the CloudFront CDN updates globally.

## Heroku

Handy deployment diagram:

```
 ... automatically deploys to ...

             ---> Heroku-eu-staging ---> Heroku-eu-production
           /
GitHub ---
           \
             ---> Heroku-us-staging ---> Heroku-us-production

                        ... manually promoted to ...
```

### Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command)
- [Heroku Pipelines plugin](https://devcenter.heroku.com/articles/labs-pipelines#enable-pipelines).

### Staging

- [donate-mozilla-org-eu-staging](https://dashboard.heroku.com/apps/donate-mozilla-org-eu-staging/resources)
- [donate-mozilla-org-us-staging](https://dashboard.heroku.com/apps/donate-mozilla-org-us-staging/resources)

Heroku will automatically deploy the [master branch](https://github.com/mozilla/donate.mozilla.org) to the staging application in both regions **after** tests have passed.

### Production

- [donate-mozilla-org-eu-prod](https://dashboard.heroku.com/apps/donate-mozilla-org-eu-prod/resources)
- [donate-mozilla-org-us-prod](https://dashboard.heroku.com/apps/donate-mozilla-org-us-prod/resources)

We're using [Heroku Labs Pipelines](https://devcenter.heroku.com/articles/labs-pipelines) to deploy a release from staging to production.
It's currently configured so that each staging app will promote to the production app in the same region.

1. Verify what we're going to push to production:

```
$ heroku pipeline:diff -a donate-mozilla-org-eu-staging
Comparing donate-mozilla-org-eu-staging to donate-mozilla-org-eu-prod...done, donate-mozilla-org-eu-staging ahead by 1 commit:
  60d3331  2015-08-18  First pass at QA checklist  (Jon Buckley)
  47f328e  2015-08-19  Allow querystring in API routes for PayPal callbacks  (Jon Buckley)
```

2. Deploy to production:

```
$ heroku pipeline:promote -a donate-mozilla-org-eu-staging && heroku pipeline:promote -a donate-mozilla-org-us-staging
Promoting donate-mozilla-org-eu-staging to donate-mozilla-org-eu-prod.....done, v5
Promoting donate-mozilla-org-us-staging to donate-mozilla-org-us-prod.....done, v5
```

IRC notifications will be sent to #fundraising on irc.mozilla.org when promoting a release to production. Don't forget to deploy both!

### Manual deploys

If automatic deploys are not working, you can manually deploy both applications via [git deployment](https://devcenter.heroku.com/articles/git). You should also contact [Support](Support.md) to get automatic deploys back online.
