/*

 Documentation for running AB tests:

   https://github.com/mozilla/trafficcop/blob/master/documentation.md

 Also note that Traffic Cop seems to break IE11, and so we don't load
 it in that browser (using conditional script loading, something that
 only IE supports! Handy...?). As such  we need to test to see if the
 `TrafficCop` object is available to us.

*/

if (typeof Mozilla !== "undefined" && Mozilla.TrafficCop) {

  // Only run this test on the home page in en-US.
  var tc = new Mozilla.TrafficCop({
    id: "button-ordering",
    variations: {
      "test=lth": 50,
      "test=htl": 50
    }
  });

  tc.init();
}
