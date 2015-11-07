import dispatcher from '../scripts/dispatcher.js';
module.exports = {
  fieldReady: function(data) {
    window.setTimeout(function() {
      dispatcher.fire("fieldReady", data);
    });
  },
  fieldChange: function(data) {
    dispatcher.fire("fieldChange", data);
  },
  fire: dispatcher.fire
};
