module.exports = {
  fire: function(eventName, eventData) {
    var customEvent = new CustomEvent(eventName, {
      detail: eventData
    });

    window.dispatchEvent(customEvent);
  }
};
