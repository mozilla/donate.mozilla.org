/*

 Documentation for running AB tests:

   https://github.com/mozilla/trafficcop/blob/master/documentation.md

 Also note that Traffic Cop seems to break IE11, and so we don't load
 it in that browser (using conditional script loading, something that
 only IE supports! Handy...?). As such  we need to test to see if the
 `TrafficCop` object is available to us.

*/

if (typeof Mozilla !== "undefined" && Mozilla.TrafficCop) {

  // Commented for future reference
  // This test runs in amount-buttons.jsx
  // (new Mozilla.TrafficCop({
  //   id: "button-ordering",
  //   variations: {
  //     "test=lth": 0, // Low To High
  //     "test=htl": 100  // High To Low
  //   }
  // })).init();

}
