# Deployment

## AWS

- [donate.mofostaging.net](https://donate.mofostaging.net/)
- [donate.mofoprod.net](https://donate.mofoprod.net/)

Any changes to the [CloudFormation template](../ops/cloudformation.json) must be deployed manually.

The CloudFormation stacks, `donate-mozilla-org-staging` and `donate-mozilla-org-production`, are deployed in `us-east-1` in the `mofo-secure` AWS account.

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
  ea76788
```

2. Check out these commits on GitHub to ensure that you're pushing the right code to production.

3. Deploy to production:

```
$ heroku pipeline:promote -a donate-mozilla-org-eu-staging && heroku pipeline:promote -a donate-mozilla-org-us-staging
Promoting donate-mozilla-org-eu-staging to donate-mozilla-org-eu-prod.....done, v5
Promoting donate-mozilla-org-us-staging to donate-mozilla-org-us-prod.....done, v5
```

IRC notifications will be sent to #fundraising on irc.mozilla.org when promoting a release to production. Don't forget to deploy both!

### Manual deploys

If automatic deploys are not working, you can manually deploy both applications via [git deployment](https://devcenter.heroku.com/articles/git). You should also contact [Support](Support.md) to get automatic deploys back online.
