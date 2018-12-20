module.exports = function detectIE(ua) {
  var haveWindow = typeof window;

  if (!ua && haveWindow) {
      ua = window.navigator.userAgent;
  }

  if (!ua) {
      return false;
  }

  var msie = ua.indexOf('MSIE ');
  if (msie > -1) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > -1) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  // Not a version of IE, or it's IE but it's lying about
  // who it is and then that's the user's responsibility,
  // really.
  return false;
};
