/**
 * Exchange Rates
 * This file is run at build time to generate static files used elsewhere in the app
 * Further details included in the README
 */

var request = require('request');
var fs = require('fs');

var Habitat = require('habitat');
Habitat.load();
var env = new Habitat();

var openexachangeratesKey = env.get('OPENEXCHANGERATES_KEY');
var openexchangeratesAPI = 'https://openexchangerates.org/api/latest.json?app_id=';

if (!openexachangeratesKey) {
  console.error('Please set OPENEXCHANGERATES_KEY in your environment variables');
}

var pathForLatestRates = './public/exchange-rates/latest.json';


function warn(s) {
  console.warn('[exchangerates.js]', s);
}

function log(s) {
  console.info('[exchangerates.js]', s);
}

/**
 * Look to see if we've already saved a copy locally
 * @param  {Function} callback
 */
function checkForLatestLocalCopy(callback) {
  var latest;
  try {
    latest = fs.readFileSync(pathForLatestRates, 'utf-8' );
    latest = JSON.parse( latest );

    return callback(null, latest);

  } catch ( e ) {
    warn(e);
    warn('Failed to load local file ' + pathForLatestRates);
    return callback(e);
  }
}

/**
 * Fetches JSON of exchange rates from openexchangerates.org
 * @param  {Function} callback
 */
function getLatestRates(callback) {
  log('Fetching latest rates from openexchangerates.org');

  request(openexchangeratesAPI + openexachangeratesKey, function(error, response, body) {

    if (error || response.statusCode !== 200) {
      warn(error);
      return callback(error);
    }

    // save the results
    fs.writeFileSync(pathForLatestRates, body );

    return callback(null);

  });
}


// execution

checkForLatestLocalCopy(function(err, latestCopy) {
  if (err) {
    // do something?
  }
  var currentTimeStamp, snapshotTimeStamp, ageOfSnapShot, maxAge;

  log('Finished checking for local copy of exchange rates');

  if (latestCopy) {
    log('Found local copy of exchange rates');

    if (latestCopy.timestamp) {
      currentTimeStamp = Math.round(+new Date()/1000);
      snapshotTimeStamp = latestCopy.timestamp;
      ageOfSnapShot = currentTimeStamp - snapshotTimeStamp;
      maxAge = 7200; // 2hr x 60m x 60s

      if (ageOfSnapShot < maxAge) {
        log('Latest exchange rate snapshot is ' + ageOfSnapShot + ' seconds old. No need to refresh.');
        return;
      }

      // else
      log('Latest exchange rate snapshot is too old.');
    }
  }

  // else, we don't have a copy, or it needs updating
  log('Fetching latest exchange rate data now');

  getLatestRates(function() {
    log('Finished fetching latest exchange rates');
  });

});


