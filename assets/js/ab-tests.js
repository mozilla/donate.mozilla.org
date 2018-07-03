// Documentation for running AB tests. https://github.com/mozilla/trafficcop/blob/master/documentation.md

// Only run this test on the home page in en-US.
if (window.location.href.match(/\/en-US\/$|\?/)) {
  var tc = new Mozilla.TrafficCop({
    id: "nav-experiment",
    variations: {
      "test=nonav": 50,
      "test=nav": 50
    }
  });

  tc.init();
}
