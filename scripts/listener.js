module.exports = {
  on: function(eventName, callback) {
    window.addEventListener(eventName, callback);
  },
  off: function(eventName, callback) {
    window.removeEventListener(eventName, callback);
  }
};
