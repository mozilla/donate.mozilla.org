var config = require('../intl-config.json');
var po = require('node-po');
var write = require('fs-writefile-promise');
var path = require('path');

function writeFile(entries) {
  entries.reduce(function (prevEntry, entry) {
    write(path.join(process.cwd(), config.dest, entry.locale + '.json'), JSON.stringify(entry.content, null, 2), 'utf-8')
    .then(function(filename) {
      console.log('Done writing: ' + filename);
    }).catch(function(e) {
      console.log(e);
    });
  }, {});
}

function getJSON(locale) {
  return new Promise(function(resolve) {
    po.load(path.join(process.cwd(), config.src, locale, 'messages.po'), function(_po) {
      var json = {};
      _po.items.forEach(function(entry) {
        json[entry.msgid] = entry.msgstr[0];
      });
      resolve({content: json, locale: locale});
    });
  });
}

function processMessageFiles(locales) {
  return Promise.all(locales.map(getJSON));
}

processMessageFiles(config.supportedLocales)
.then(writeFile).catch(function (err) {
  console.error(err);
  throw err;
});
