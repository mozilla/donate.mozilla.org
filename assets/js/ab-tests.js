// Documentation for running AB tests. https://github.com/mozilla/trafficcop/blob/master/documentation.md

// Only run this test on the home page in en-US.
var tc = new Mozilla.TrafficCop({
    id: "image-experiment",
    variations: {
      "test=img-a": 33,
      "test=img-b": 33,
      "test=no-img": 34
    }
});

tc.init();
