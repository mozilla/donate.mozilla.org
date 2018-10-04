// Documentation for running AB tests. https://github.com/mozilla/trafficcop/blob/master/documentation.md

// Only run this test on the home page in en-US.
var tc = new Mozilla.TrafficCop({
    id: "image-experiment",
    variations: {
      "test=img-a": 50,
      "test=no-img": 50
    }
});

tc.init();
